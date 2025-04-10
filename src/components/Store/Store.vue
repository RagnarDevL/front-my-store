<template>
  <NeuronBackground />
  <div style="position: relative; margin-top: 80px; background-color: transparent">
    <v-container>
      <v-row>
        <v-col v-for="(item, index) in productsData" :key="index" cols="12" md="4">
          <div class="card" :class="{ 'flipped': item.isFlipped }">
            
            <div class="content">
              
              <div class="back">
                <div class="back-content">
                  <svg stroke="#ffffff" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 50 50" height="50px" width="50px" fill="#ffffff">

                    <g stroke-width="0" id="SVGRepo_bgCarrier"></g>

                    <g stroke-linejoin="round" stroke-linecap="round" id="SVGRepo_tracerCarrier"></g>

                    <g id="SVGRepo_iconCarrier">

                    </g>

                  </svg>
                  <a class="mobile-flip-button" @click.stop="toggleFlip(item)">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 6C6 6 2 12 2 12C2 12 6 18 12 18C18 18 22 12 22 12C22 12 18 6 12 6Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" fill="currentColor"/>
                    </svg>
                  </a>
                  <strong style="font-size: 40px;">{{ item.name }}</strong>
                  <small class="badge">Cupos disponibles: {{ item.stock }}</small>

                </div>
              </div>
              <div class="front">

                <div class="img">
                  <div class="circle">
                  </div>
                  <div class="circle" id="right">
                  </div>
                  <div class="circle" id="bottom">
                  </div>
                </div>

                <div class="front-content">
                  <small class="badge">{{ item.name }}</small>
                  <div class="description">
                    <div class="title">
                      <p class="title">
                        <strong>{{ item.description }}</strong>
                      </p>
                      <svg fill-rule="nonzero" height="15px" width="15px" viewBox="0,0,256,256"
                        xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg">
                        <g style="mix-blend-mode: normal" text-anchor="none" font-size="none" font-weight="none"
                          font-family="none" stroke-dashoffset="0" stroke-dasharray="" stroke-miterlimit="10"
                          stroke-linejoin="miter" stroke-linecap="butt" stroke-width="1" stroke="none"
                          fill-rule="nonzero" fill="#20c997">
                          <g transform="scale(8,8)">
                            <path d="M25,27l-9,-6.75l-9,6.75v-23h18z"></path>
                          </g>
                        </g>
                      </svg>
                    </div>
                    <p class="card-footer">
                      Precio: {{ item.price }} &nbsp; | &nbsp;Cupos: {{ item.stock }}
                    </p>
                  </div>
                  <!-- From Uiverse.io by 212004ALJI -->
                  <button @click.prevent="openModal(item)">
                    inscribirme
                  </button>
                </div>
              </div>
            </div>
          </div>


        </v-col>
      </v-row>
    </v-container>

    <!-- Modal para la tarjeta de crédito -->
    <v-dialog v-model="dialog" max-width="950px" persistent>
      <v-card class="modal-card" style="background-color: #582b9c; color: white">
        <v-card-title>
          Pago para curso: {{ currentProduct.name }} ({{ currentProduct.price }})
        </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <div class="card-input-container">
            <v-text-field 
              v-model="cardData.number" 
              label="Número de tarjeta" 
              required 
              :rules="[
                v => !!v || 'El número de tarjeta es requerido',
                v => this.detectCardType(v) || 'Solo aceptamos VISA (comienza con 4) o MasterCard (comienza con 51-55)',
                v => this.validateCardNumber(v) || 'Número de tarjeta inválido. Verifique los dígitos'
              ]" 
              @input="cardData.type = detectCardType(cardData.number)"
              outlined
              autocomplete="cc-number"
              inputmode="numeric"
              pattern="[0-9\s]{13,19}"
            ></v-text-field>
              
              <div class="card-logos">
                <img 
                  :src="visaLogo" 
                  class="card-logo" 
                  :class="{ active: cardData.type === 'visa' }"
                  alt="Visa"
                >
                <img 
                  :src="mastercardLogo" 
                  class="card-logo" 
                  :class="{ active: cardData.type === 'mastercard' }"
                  alt="Mastercard"
                >
              </div>
            </div>
            <v-text-field v-model="cardData.name" label="Nombre en la tarjeta" required
              :rules="[v => !!v || 'Campo requerido']"
              autocomplete="cc-name"></v-text-field>
            <v-text-field 
              v-model="cardData.expiry" 
              label="Expiración (MM/AA)" 
              required
              :rules="[
                v => !!v || 'La fecha de expiración es requerida', 
                v => /^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(v) || 'Formato incorrecto. Use MM/AA (ej: 12/25)',
                v => this.validateExpiryDate(v) || 'La tarjeta está expirada o la fecha es inválida'
              ]"
              outlined
              autocomplete="cc-exp"
              inputmode="numeric"
            ></v-text-field>
            <v-text-field v-model="cardData.cvv" label="CVV" required
              :rules="[v => !!v || 'Campo requerido', v => /^\d{3,4}$/.test(v) || 'CVV inválido']"
              type="password"
              autocomplete="cc-csc"
              inputmode="numeric"></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <button 
            color="green" 
            text 
            @click="submitCardData" 
            :disabled="loading || !validateForm()"
            :class="{ 'disabled-btn': loading || !validateForm() }"
          >
            Continuar
          </button>
          <button color="red" text @click="dialog = false" :disabled="loading">Cancelar</button>
        </v-card-actions>

        <!-- Full page spinner overlay -->
        <div v-if="loading" class="full-page-overlay">
          <div class="full-page-spinner"></div>
        </div>
      </v-card>
    </v-dialog>

    <!-- Success Alert -->
    <v-dialog v-model="showSuccessAlert" max-width="500px" persistent>
      <v-card style="background-color: #4CAF50; color: white">
        <v-card-title class="text-h5">{{ alertTitle }}</v-card-title>
        <v-card-text>
          {{ alertText }}
        </v-card-text>
        <v-card-actions>
          <button 
            style="margin: 0 auto; padding: 8px 16px; background: white; color: #4CAF50; border: none; border-radius: 4px; cursor: pointer;"
            @click="handleSuccessAlertConfirm"
          >
            Aceptar
          </button>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Shipping Modal -->
    <v-dialog v-model="shippingDialog" max-width="950px" persistent>
      <v-card class="modal-card" style="background-color: #582b9c; color: white">
        <v-card-title>
          Información de envío
        </v-card-title>
        <v-card-text>
          <v-form ref="shippingForm">
            <v-text-field 
              v-model="shippingData.fullName" 
              label="Nombre completo" 
              required
              :rules="[v => !!v || 'Nombre completo es requerido']"
            ></v-text-field>
            <v-text-field 
              v-model="shippingData.documentId" 
              label="Documento de identificación" 
              required
              :rules="[
                v => !!v || 'Documento es requerido',
                v => (v.length >= 6 && v.length <= 12) || 'Documento debe tener entre 6-12 caracteres'
              ]"
            ></v-text-field>
            <v-text-field 
              v-model="shippingData.phone" 
              label="Teléfono" 
              required
              :rules="[
                v => !!v || 'Teléfono es requerido',
                v => /^[0-9]{10,15}$/.test(v) || 'Teléfono inválido (10-15 dígitos)'
              ]"
            ></v-text-field>
            <v-text-field 
              v-model="shippingData.email" 
              label="Email" 
              type="email"
              required
              :rules="[
                v => !!v || 'Email es requerido',
                v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Email inválido'
              ]"
            ></v-text-field>
            <v-text-field 
              v-model="shippingData.address" 
              label="Dirección" 
              required
              :rules="[
                v => !!v || 'Dirección es requerida',
                v => (v && v.length > 5) || 'Dirección muy corta (mínimo 6 caracteres)'
              ]"
            ></v-text-field>
            <v-text-field 
              v-model="shippingData.city" 
              label="Ciudad" 
              required
              :rules="[v => !!v || 'Ciudad es requerida']"
            ></v-text-field>
            <v-text-field 
              v-model="shippingData.state" 
              label="Región" 
              required
              :rules="[v => !!v || 'Región es requerida']"
            ></v-text-field>
            <v-text-field 
              v-model="shippingData.zipCode" 
              label="Código postal" 
              required
              :rules="[
                v => !!v || 'Código postal es requerido',
                v => /^[0-9]{4,6}$/.test(v) || 'Código postal inválido (4-6 dígitos)'
              ]"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <button 
            color="green" 
            text 
            @click="submitShippingData"
            :disabled="loading || !validateShippingForm()"
            style="position: relative;"
          >
            <span v-if="!loading">Confirmar inscripcion y pagar</span>
            <span v-else>
              <v-progress-circular
                indeterminate
                color="white"
                size="20"
                width="2"
                style="margin-right: 8px;"
              ></v-progress-circular>
              Procesando...
            </span>
          </button>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Purchase Summary Modal -->
    <v-dialog v-model="showSummaryModal" max-width="950px" persistent>
      <v-card class="modal-card" style="background-color: #582b9c; color: white">
        <v-card-title>
          ¡Pago Exitoso! - Resumen de tu compra
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" md="6">
                <h3>Detalles del producto:</h3>
                <p><strong>Curso:</strong> {{ purchaseSummary.product.name }}</p>
                <p><strong>Precio:</strong> {{ purchaseSummary.product.price }}</p>
                <p><strong>Fecha:</strong> {{ purchaseSummary.paymentDetails.date }}</p>
                <p><strong>Referencia:</strong> {{ purchaseSummary.paymentDetails.reference }}</p>
              </v-col>
              <v-col cols="12" md="6">
                <h3>Datos de envío:</h3>
                <p><strong>Nombre:</strong> {{ purchaseSummary.shipping.fullName }}</p>
                <p><strong>Dirección:</strong> {{ purchaseSummary.shipping.address }}</p>
                <p><strong>Ciudad:</strong> {{ purchaseSummary.shipping.city }}</p>
                <p><strong>Estado:</strong> {{ purchaseSummary.shipping.state }}</p>
                <p><strong>Código postal:</strong> {{ purchaseSummary.shipping.zipCode }}</p>
                <p><strong>Teléfono:</strong> {{ purchaseSummary.shipping.phone }}</p>
                <p><strong>Email:</strong> {{ purchaseSummary.shipping.email }}</p>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <button 
            style="margin: 0 auto; padding: 8px 16px; background: white; color: #582b9c; border: none; border-radius: 4px; cursor: pointer;"
            @click="closeSummaryModal"
          >
            Cerrar
          </button>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
  <!-- From Uiverse.io by Nawsome -->


</template>


<script src="./script.js"></script>

<style scoped>
@import "./styles.css";
</style>
