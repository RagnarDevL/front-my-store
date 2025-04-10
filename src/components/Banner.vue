<template>
  <header class="banner">
    <div class="banner-content">
      <h1>Este es nuestro listado de cursos de programación ¡Inscribite ahora!</h1>
    </div>
  </header>
</template>

<style scoped>
.banner {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 60px;
  padding: 1rem 0;
  background-color: #582b9c;
  color: rgba(255, 255, 255, 0.87);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.banner-content {
  width: 100%;
  max-width: 1280px;
  padding: 0 2rem;
  text-align: center;
}

.banner-content h1 {
  margin: 0;
  font-size: 1.5rem;
  line-height: 1.2;
}

@media (max-width: 768px) {
  .banner {
    padding: 0.75rem 0;
  }
  
  .banner-content h1 {
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .banner {
    padding: 0.5rem 0;
  }
  
  .banner-content {
    padding: 0 1rem;
  }
  
  .banner-content h1 {
    font-size: 1rem;
  }
}
</style>
