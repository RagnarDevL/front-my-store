
import NeuronBackground from '../NeuronBackground.vue';
import visaLogo from '../../assets/img/visa.svg';
import mastercardLogo from '../../assets/img/mastercard.svg';

export default {
components: {
  NeuronBackground
},
  name: "Store",
  data: () => ({
    visaLogo,
    mastercardLogo,
    dialog: false,
    dialogOptions: {
      scrollable: true,
      persistent: false,
      'content-class': 'dialog-container'
    },
      loading: false,
      showSuccessAlert: false,
      alertTitle: '',
      alertText: '',
      shippingDialog: false,
    currentProduct: null,
    cardData: {
      number: "",
      name: "",
      expiry: "",
      cvv: "",
      type: null,
    },
    shippingData: {
      fullName: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      phone: "",
      email: "",
      documentId: ""
    },
    showSummaryModal: false,
    purchaseSummary: {
      product: null,
      shipping: null,
      paymentDetails: null
    },
    productsData: [
      
    ],
  }),
  mounted() {
    this.getProducts();
  },
  methods: {
    async getProducts() {
      try {
        const response = await fetch('http://3.16.169.182:3000/api/products');
        const data = await response.json();
        this.productsData = data;
        console.log('3.16.169.182 connection test:', data);
      } catch (error) {
        console.error('Failed to connect to 3.16.169.182:', error);
      }
    },
    openModal(product) {
      try {
        console.log('Opening modal for product:', product);
        if (!product) {
          throw new Error('No product provided');
        }
        this.currentProduct = product;
        this.dialog = true;
        
      } catch (error) {
        console.error('Error opening modal:', error);
      }
    },
    detectCardType(number) {
      if (/^4/.test(number)) return 'visa';
      if (/^5[1-5]/.test(number)) return 'mastercard';
      return null;
    },
    
    validateCardNumber(number) {
      if (!number) return false;
      
      const type = this.detectCardType(number);
      if (!type) return false;
      
      // Remove non-digits
      const cleanNumber = number.replace(/\D/g, '');
      
      // Validate length based on card type
      if (type === 'visa' && ![13, 16].includes(cleanNumber.length)) return false;
      if (type === 'mastercard' && cleanNumber.length !== 16) return false;
      
      // Luhn algorithm check
      let sum = 0;
      for (let i = 0; i < cleanNumber.length; i++) {
        let digit = parseInt(cleanNumber[i]);
        if ((cleanNumber.length - i) % 2 === 0) {
          digit *= 2;
          if (digit > 9) digit -= 9;
        }
        sum += digit;
      }
      return sum % 10 === 0;
    },

    validateExpiryDate(expiry) {
      if (!expiry) return false;
      
      // Check format MM/YY
      if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(expiry)) return false;
      
      const [month, year] = expiry.split('/');
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      
      // Check if card is expired
      if (parseInt(year) < currentYear) return false;
      if (parseInt(year) === currentYear && parseInt(month) < currentMonth) return false;
      
      return true;
    },

    validateForm() {
      return (
        this.validateCardNumber(this.cardData.number) &&
        this.cardData.name.trim().length > 0 &&
        this.validateExpiryDate(this.cardData.expiry) &&
        /^\d{3,4}$/.test(this.cardData.cvv)
      );
    },
    
    validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },
    validatePhone(phone) {
      return /^[0-9]{10,15}$/.test(phone); 
    },
    validateDocumentId(doc) {
      return doc.length >= 6 && doc.length <= 12;
    },
    validateZipCode(zip) {
      return /^[0-9]{4,6}$/.test(zip);
    },
    validateShippingForm() {
      return (
        this.shippingData.fullName.trim().length > 0 &&
        this.validateDocumentId(this.shippingData.documentId) &&
        this.validatePhone(this.shippingData.phone) &&
        this.validateEmail(this.shippingData.email) &&
        this.shippingData.address.trim().length > 5 &&
        this.shippingData.city.trim().length > 0 &&
        this.shippingData.state.trim().length > 0 &&
        this.validateZipCode(this.shippingData.zipCode)
      );
    },

    formatPrice(price) {
      if (typeof price === 'number') {
        return price;
      }
      if (typeof price === 'string') {
        return parseFloat(price.replace('$', '').replace(',', ''));
      }
      throw new Error('Invalid price format');
    },

    async submitCardData() {
      if (!this.validateForm()) {
        this.$refs.form.validate();
        return;
      }

      this.loading = true;
      
      try {
        const cardDataToEncrypt = {
          number: this.cardData.number.replace(/\s+/g, ''),
          name: this.cardData.name.trim(),
          expiry: this.cardData.expiry.replace(/\D/g, ''),
          cvv: this.cardData.cvv
        };

       

        const encryptedData = this.$store.getters['transactions/encryptData'](
          JSON.stringify(cardDataToEncrypt)
        );

        this.loading = false;
        this.dialog = false;
        this.alertTitle = '¡Tarjeta de Credito Valida!';
        this.alertText = 'Hemos validado tu tarjeta de credito, vamos a el proceso de envio para tus Libros Fisicos y el correo para programar las sesiones.';
        this.showSuccessAlert = true;
        
        localStorage.setItem('data', encryptedData)
        localStorage.setItem('amount', this.formatPrice(this.currentProduct.price*100))
        localStorage.setItem('product', this.currentProduct.name)
          
        
      } catch (error) {
        console.error('Payment error:', error);
        this.loading = false;
        alert('Error procesando el pago: ' + error.message);
      }
    },
    
    handleSuccessAlertConfirm() {
      if (this.shippingDialog == null) {
        
        this.showSuccessAlert = false;
        this.shippingDialog = false;
      }
      else{
        this.showSuccessAlert = false;
        this.shippingDialog = true;
      }
    },
    closeSshippingDialog() {
      this.shippingDialog = false;
    },
    
    closeSummaryModal() {
      this.showSummaryModal = false;
      // Clear form data
      this.cardData = {
        number: "",
        name: "",
        expiry: "",
        cvv: "",
        type: null
      };
      this.shippingData = {
        fullName: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        phone: "",
        email: ""
      };
      window.location.reload();

    },
    
    toggleFlip(item) {
      item.isFlipped = !item.isFlipped;
    },
    async submitShippingData() {
      if (!this.validateShippingForm()) {
        this.$refs.shippingForm.validate();
        return;
      }
      this.loading = true;
      try {
        const encryptedData = localStorage.getItem('data')
        const amount = localStorage.getItem('amount')
        const product = localStorage.getItem('product')

        const response = await fetch('http://3.16.169.182:3000/api/payments/secure', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            encryptedData: encryptedData,
            amount: this.currentProduct.price*100, 
            product: this.currentProduct.name,
            shippingData: this.shippingData
          })
        });

        if (!response.ok) throw new Error('Payment processing failed');
        
        const result = await response.json();
        if (result.success) {
          this.dialog = false;
          this.shippingDialog = null;
          
          this.purchaseSummary = {
            product: this.currentProduct,
            shipping: {...this.shippingData},
            paymentDetails: {
              amount: this.currentProduct.price*100, 
              date: new Date().toLocaleString(),
              reference: result.reference || 'N/A'
            }
          };
          
          this.showSummaryModal = true;
        } else {
          throw new Error(result.message || 'Payment failed');
        }
      } catch (error) {
        console.error('Payment error:', error);
        alert('Error procesando el pago: ' + error.message);
      } finally {
        this.loading = false;
      }
    },
  },
};
