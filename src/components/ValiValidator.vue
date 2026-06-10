<template>
  <div class="min-h-screen bg-[#efeae2]">
    <!-- Header estilo WhatsApp -->
    <header class="bg-[#008069] text-white shadow-md">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <h1 class="text-lg font-semibold">Vali</h1>
              <p class="text-xs text-[#d1f4cc]">
                Validador de Pre-Facturas con IA
                <span v-if="systemInfo && systemInfo.aiProvider && systemInfo.aiModel" class="ml-2 opacity-80">
                  • {{ systemInfo.aiProvider }} ({{ systemInfo.aiModel }})
                </span>
              </p>
            </div>
          </div>
          <div v-if="sessionId" class="flex items-center space-x-2">
            <button
              @click="resetValidation"
              class="hover:bg-white/10 p-2 rounded-full transition-colors"
              title="Nueva Validación"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">

        <!-- Step 1: Upload File - estilo WhatsApp -->
        <div v-if="currentStep === 'upload'" class="bg-white rounded-lg shadow-sm p-6 max-w-2xl mx-auto">
          <div class="mb-6 text-center">
            <h2 class="text-xl font-bold text-gray-800 mb-2">CONSTRUCCION Y DESARROLLO DE PROYECTOS GOES</h2>
            <p class="text-lg font-medium text-gray-700">Envía tu pre-factura para validar</p>
          </div>

          <div class="space-y-4">
            <!-- File Upload Area - estilo burbuja de chat -->
            <div
              @dragover.prevent
              @drop.prevent="handleFileDrop"
              class="border-2 border-dashed border-[#d1d5db] rounded-lg p-8 text-center hover:border-[#008069] transition-colors cursor-pointer bg-[#f0f2f5]"
              :class="{ 'border-[#008069] bg-[#d1f4cc]/20': isDragging }"
              @dragenter="isDragging = true"
              @dragleave="isDragging = false"
            >
              <input
                ref="fileInput"
                type="file"
                accept=".pdf,.xml"
                @change="handleFileSelect"
                class="hidden"
              />

              <div v-if="!selectedFile">
                <svg class="mx-auto h-10 w-10 text-[#008069]" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <p class="mt-3 text-base font-medium text-gray-700">Arrastra tu archivo aquí</p>
                <p class="mt-1 text-sm text-gray-500">o haz clic para seleccionar</p>
                <p class="mt-1 text-xs text-gray-400">PDF o XML (máximo 10 MB)</p>
                <button
                  @click="$refs.fileInput.click()"
                  class="mt-4 px-5 py-2 bg-[#008069] text-white rounded-full hover:bg-[#00665a] transition-colors text-sm font-medium"
                >
                  Seleccionar Archivo
                </button>
              </div>

              <div v-else class="flex flex-col items-center space-y-3">
                <div class="inline-flex items-center space-x-3 bg-white px-4 py-3 rounded-lg shadow-sm">
                  <svg class="w-8 h-8 text-[#008069]" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd"/>
                  </svg>
                  <div class="text-left">
                    <p class="text-sm font-medium text-gray-900">{{ selectedFile.name }}</p>
                    <p class="text-xs text-gray-500">{{ formatFileSize(selectedFile.size) }}</p>
                  </div>
                </div>
                <button
                  @click="clearFile"
                  class="text-xs text-[#008069] hover:underline block"
                >
                  Remover archivo
                </button>
              </div>
            </div>

            <!-- Validate Button - estilo mensaje de WhatsApp -->
            <div v-if="selectedFile" class="mt-4">
              <button
                @click="startValidation"
                :disabled="isLoading"
                class="w-full py-3 bg-[#008069] text-white font-medium rounded-lg hover:bg-[#00665a] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                {{ isLoading ? 'Validando...' : 'Validar Pre-Factura ✓' }}
              </button>
              <p class="mt-2 text-xs text-gray-500 text-center">
                Se validará si la pre-factura está lista para timbrar
              </p>
            </div>
          </div>
        </div>

        <!-- Step 2: Validating - estilo mensaje de espera -->
        <div v-if="currentStep === 'validating'" class="bg-white rounded-lg shadow-sm p-6 max-w-2xl mx-auto">
          <div class="text-center">
            <div class="inline-flex items-center justify-center w-14 h-14 bg-[#d1f4cc] rounded-full mb-3">
              <svg class="w-7 h-7 text-[#008069] animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h2 class="text-lg font-semibold text-gray-700 mb-1">Validando Pre-Factura</h2>
            <p class="text-sm text-gray-500">Verificando que cumpla con las reglas de nuestra empresa...</p>
          </div>
        </div>

        <!-- Step 3: Question from Agent - estilo burbuja de mensaje -->
        <div v-if="currentStep === 'question'" class="max-w-2xl mx-auto">
          <div class="space-y-3">
            <!-- Burbuja de pregunta (estilo mensaje recibido) -->
            <div class="flex items-start space-x-2">
              <div class="flex-shrink-0 w-8 h-8 bg-[#d1d5db] rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div class="flex-1 bg-white rounded-lg rounded-tl-none shadow-sm p-4 max-w-md">
                <p class="text-sm font-medium text-gray-900 mb-3">{{ currentQuestion.text }}</p>

                <div v-if="currentQuestion.options" class="space-y-2">
                  <button
                    v-for="(option, index) in currentQuestion.options"
                    :key="index"
                    @click="answerQuestion(option.value)"
                    :disabled="isLoading"
                    class="w-full text-left px-3 py-2 border border-[#008069] rounded-md hover:bg-[#d1f4cc]/30 transition-colors disabled:opacity-50 text-sm text-gray-700"
                  >
                    {{ option.label }}
                  </button>
                </div>

                <div v-else>
                  <textarea
                    v-model="userAnswer"
                    rows="3"
                    placeholder="Escribe tu respuesta..."
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#008069] focus:border-transparent mb-2 text-sm"
                  ></textarea>
                  <button
                    @click="answerQuestion(userAnswer)"
                    :disabled="!userAnswer.trim() || isLoading"
                    class="w-full py-2 bg-[#008069] text-white font-medium rounded-lg hover:bg-[#00665a] disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
                  >
                    {{ isLoading ? 'Enviando...' : 'Enviar ✓' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 4: Results - estilo chat de WhatsApp -->
        <div v-if="currentStep === 'results'" class="max-w-3xl mx-auto space-y-3 pb-20">
          <!-- Mensaje de abort si la factura no es para la empresa -->
          <div v-if="validationResult.abortReason" class="flex items-start space-x-2 mb-4">
            <div class="flex-shrink-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </div>
            <div class="flex-1 max-w-md">
              <div class="bg-red-50 border-l-4 border-red-500 rounded-lg rounded-tl-none shadow-sm p-4">
                <p class="text-sm font-semibold text-red-600">⛔ Documento no válido</p>
              </div>
              <p class="text-xs text-gray-400 mt-1 ml-2">Hace un momento</p>
            </div>
          </div>

          <!-- Burbuja de estado (mensaje del bot) - solo si NO hay abortReason -->
          <div v-if="!validationResult.abortReason" class="flex items-start space-x-2">
            <div class="flex-shrink-0 w-8 h-8 bg-[#d1d5db] rounded-full flex items-center justify-center">
              <svg
                v-if="validationResult.finalStatus === 'LISTO_PARA_TIMBRAR'"
                class="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              <svg
                v-else
                class="w-5 h-5 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </div>
            <div class="flex-1 max-w-md">
              <div
                class="rounded-lg rounded-tl-none shadow-sm p-4"
                :class="{
                  'bg-[#d1f4cc]': validationResult.finalStatus === 'LISTO_PARA_TIMBRAR',
                  'bg-white': validationResult.finalStatus === 'REQUIERE_CORRECCIONES'
                }"
              >
                <p class="text-sm font-semibold mb-1">
                  {{ validationResult.finalStatus === 'LISTO_PARA_TIMBRAR' ? '✓ Lista para timbrar' : '✗ Requiere correcciones' }}
                </p>
                <p class="text-xs text-gray-600">
                  {{ validationResult.finalStatus === 'LISTO_PARA_TIMBRAR'
                    ? 'Tu pre-factura cumple con todas las reglas de nuestra empresa'
                    : 'Encontré algunos problemas que debes corregir' }}
                </p>
              </div>
              <p class="text-xs text-gray-400 mt-1 ml-2">Hace un momento</p>
            </div>
          </div>

          <!-- Errores detectados agrupados en una burbuja -->
          <div v-if="validationResult.errors && validationResult.errors.length > 0" class="flex items-start space-x-2">
            <div class="flex-shrink-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <div class="flex-1 max-w-md">
              <div class="bg-white rounded-lg rounded-tl-none shadow-sm p-4 border-l-4 border-red-500">
                <p class="text-sm font-semibold text-red-600 mb-3">Errores detectados ({{ validationResult.errors.length }})</p>
                <div class="space-y-3">
                  <div v-for="(error, index) in validationResult.errors" :key="'error-' + index" class="flex items-start space-x-2">
                    <span class="flex-shrink-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {{ index + 1 }}
                    </span>
                    <p class="flex-1 text-sm text-gray-800 leading-relaxed">{{ error.message || error }}</p>
                  </div>
                </div>
              </div>
              <p class="text-xs text-gray-400 mt-1 ml-2">Hace un momento</p>
            </div>
          </div>

          <!-- Advertencias como burbujas -->
          <div v-if="validationResult.warnings && validationResult.warnings.length > 0" class="space-y-2">
            <div class="flex items-start space-x-2" v-for="(warning, index) in validationResult.warnings" :key="'warning-' + index">
              <div class="flex-shrink-0 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                ⚠
              </div>
              <div class="flex-1 max-w-md">
                <div class="bg-white rounded-lg rounded-tl-none shadow-sm p-3">
                  <p class="text-sm text-gray-800">{{ warning.message || warning }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Detalle de validaciones exitosas agrupadas por categoría -->
          <!-- Solo mostrar si NO hay abortReason (validación no se detuvo) -->
          <div v-if="!validationResult.abortReason && passedValidations.length > 0" class="flex items-start space-x-2">
            <div class="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="flex-1 max-w-md">
              <div class="bg-white rounded-lg rounded-tl-none shadow-sm p-4 border-l-4 border-green-500">
                <p class="text-sm font-semibold text-green-600 mb-3">Validaciones correctas ({{ passedValidations.length }})</p>

                <!-- Agrupar por categoría -->
                <div v-for="category in categoryOrder" :key="category" class="mb-3 last:mb-0">
                  <div v-if="validationsByCategory[category] && validationsByCategory[category].length > 0">
                    <p class="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                      {{ categoryNames[category] }} ({{ validationsByCategory[category].length }})
                    </p>
                    <div class="space-y-2 ml-2">
                      <div
                        v-for="(validation, index) in validationsByCategory[category]"
                        :key="index"
                        class="flex items-start space-x-2 text-xs"
                      >
                        <span class="text-green-600 flex-shrink-0">✓</span>
                        <p class="flex-1 text-gray-700 leading-relaxed">{{ validation.message }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <p class="text-xs text-gray-400 mt-1 ml-2">Hace un momento</p>
            </div>
          </div>
        </div>

        <!-- Botón flotante estilo WhatsApp (fijo abajo) -->
        <div v-if="currentStep === 'results'" class="fixed bottom-0 left-0 right-0 bg-[#f0f2f5] border-t border-gray-200 p-4">
          <div class="max-w-3xl mx-auto">
            <button
              @click="resetValidation"
              class="w-full py-3 bg-[#008069] text-white font-medium rounded-full hover:bg-[#00665a] transition-colors shadow-lg flex items-center justify-center space-x-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              <span>Validar Otra Pre-Factura</span>
            </button>
          </div>
        </div>

        <!-- Error State - estilo burbuja de mensaje -->
        <div v-if="error" class="mt-4 max-w-2xl mx-auto">
          <div class="flex items-start space-x-2">
            <div class="flex-shrink-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div class="flex-1 max-w-md">
              <div class="bg-white rounded-lg rounded-tl-none shadow-sm p-3 border-l-4 border-red-500">
                <p class="text-xs font-semibold text-red-800 mb-1">Error</p>
                <p class="text-sm text-gray-700">{{ error }}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import valiService from '../services/valiService.js';

const currentStep = ref('upload'); // 'upload', 'validating', 'question', 'results'
const selectedFile = ref(null);
const fileInput = ref(null);
const isDragging = ref(false);
const isLoading = ref(false);
const error = ref(null);

const sessionId = ref(null);
const fileId = ref(null);
const currentQuestion = ref(null);
const userAnswer = ref('');
const validationResult = ref(null);
const systemInfo = ref({
  aiProvider: null,
  aiModel: null,
  version: '1.0.0'
});

// Cargar información del sistema al montar el componente
onMounted(async () => {
  try {
    const info = await valiService.getSystemInfo();
    systemInfo.value = info;
  } catch (err) {
    console.error('Error loading system info:', err);
  }
});

// Computed property para filtrar solo validaciones exitosas
const passedValidations = computed(() => {
  if (!validationResult.value?.validations) return [];
  return validationResult.value.validations.filter(v => v.status === 'passed');
});

// Computed property para agrupar validaciones por categoría
const validationsByCategory = computed(() => {
  if (!validationResult.value?.validations) return {};

  const passed = validationResult.value.validations.filter(v => v.status === 'passed');
  const grouped = {};

  passed.forEach(validation => {
    const category = validation.category || 'otros';
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(validation);
  });

  return grouped;
});

// Nombres amigables para las categorías
const categoryNames = {
  'receptor': 'Datos del Receptor',
  'emisor': 'Datos del Emisor',
  'uso_cfdi': 'Uso de CFDI',
  'impuestos': 'Impuestos y Retenciones',
  'pago': 'Forma de Pago',
  'conceptos': 'Conceptos',
  'timbrado': 'Timbrado',
  'otros': 'Otras Validaciones'
};

// Orden de las categorías
const categoryOrder = ['receptor', 'emisor', 'uso_cfdi', 'impuestos', 'pago', 'conceptos', 'timbrado', 'otros'];

const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    validateAndSetFile(file);
  }
};

const handleFileDrop = (event) => {
  isDragging.value = false;
  const file = event.dataTransfer.files[0];
  if (file) {
    validateAndSetFile(file);
  }
};

const validateAndSetFile = (file) => {
  // Validate file type
  const validTypes = ['application/pdf', 'text/xml', 'application/xml'];
  if (!validTypes.includes(file.type) && !file.name.endsWith('.xml')) {
    error.value = 'Solo se permiten archivos PDF o XML';
    return;
  }

  // Validate file size (10 MB)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    error.value = 'El archivo es muy grande. Máximo 10 MB';
    return;
  }

  selectedFile.value = file;
  error.value = null;
};

const clearFile = () => {
  selectedFile.value = null;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

const startValidation = async () => {
  if (!selectedFile.value || isLoading.value) return;

  isLoading.value = true;
  error.value = null;

  try {
    // Step 1: Upload file
    const uploadResponse = await valiService.uploadFile(selectedFile.value);
    sessionId.value = uploadResponse.sessionId;
    fileId.value = uploadResponse.fileId;

    currentStep.value = 'validating';

    // Step 2: Start validation (sin companyData, se extrae del CFDI)
    const validateResponse = await valiService.validateCFDI(
      sessionId.value,
      fileId.value,
      null // companyData es null, se extraerá del PDF/XML
    );

    handleValidationResponse(validateResponse);

  } catch (err) {
    console.error('Error during validation:', err);
    error.value = err.response?.data?.error || err.message || 'Error al validar el CFDI';
    currentStep.value = 'upload';
  } finally {
    isLoading.value = false;
  }
};

const answerQuestion = async (answer) => {
  if (!answer || isLoading.value) return;

  isLoading.value = true;
  error.value = null;

  try {
    const response = await valiService.continueValidation(sessionId.value, answer);
    handleValidationResponse(response);
  } catch (err) {
    console.error('Error answering question:', err);
    error.value = err.response?.data?.error || err.message || 'Error al enviar la respuesta';
  } finally {
    isLoading.value = false;
    userAnswer.value = '';
  }
};

const handleValidationResponse = (response) => {
  console.log('🔍 Response recibida:', response);
  console.log('🔍 abortReason:', response.result?.abortReason);

  if (response.status === 'waiting_for_user') {
    currentStep.value = 'question';
    currentQuestion.value = response.question;
  } else if (response.status === 'completed') {
    currentStep.value = 'results';
    validationResult.value = response.result;
  } else {
    // Still processing
    currentStep.value = 'validating';
  }
};

const resetValidation = () => {
  currentStep.value = 'upload';
  selectedFile.value = null;
  sessionId.value = null;
  fileId.value = null;
  currentQuestion.value = null;
  validationResult.value = null;
  userAnswer.value = '';
  error.value = null;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};
</script>
