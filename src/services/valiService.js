import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Servicio para interactuar con la API de Vali
 */
class ValiService {
  /**
   * Sube un archivo PDF o XML al servidor
   * @param {File} file - Archivo a subir
   * @returns {Promise<{fileId: string, sessionId: string, fileName: string, fileSize: number}>}
   */
  async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API_BASE_URL}/api/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  /**
   * Inicia la validación de un CFDI
   * @param {string} sessionId - ID de la sesión
   * @param {string} fileId - ID del archivo subido
   * @param {Object|null} companyData - Datos de la empresa (opcional, se extraen del CFDI)
   * @returns {Promise<Object>}
   */
  async validateCFDI(sessionId, fileId, companyData = null) {
    const payload = {
      sessionId,
      fileId,
    };

    // Solo incluir companyData si está presente
    if (companyData) {
      payload.companyData = companyData;
    }

    const response = await axios.post(`${API_BASE_URL}/api/validate`, payload);

    return response.data;
  }

  /**
   * Continúa una validación con la respuesta del usuario
   * @param {string} sessionId - ID de la sesión
   * @param {string} answer - Respuesta del usuario
   * @returns {Promise<Object>}
   */
  async continueValidation(sessionId, answer) {
    const response = await axios.post(`${API_BASE_URL}/api/continue/${sessionId}`, {
      answer,
    });

    return response.data;
  }

  /**
   * Consulta el estado de una validación
   * @param {string} sessionId - ID de la sesión
   * @returns {Promise<Object>}
   */
  async getStatus(sessionId) {
    const response = await axios.get(`${API_BASE_URL}/api/status/${sessionId}`);
    return response.data;
  }

  /**
   * Verifica que el servidor esté disponible
   * @returns {Promise<boolean>}
   */
  async healthCheck() {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`);
      return response.data.status === 'ok';
    } catch (error) {
      return false;
    }
  }

  /**
   * Obtiene información del sistema (provider de IA, modelo, versión)
   * @returns {Promise<{aiProvider: string, aiModel: string, version: string, environment: string}>}
   */
  async getSystemInfo() {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/info`);
      return response.data;
    } catch (error) {
      return {
        aiProvider: 'DESCONOCIDO',
        aiModel: 'N/A',
        version: '1.0.0',
        environment: 'production'
      };
    }
  }
}

export default new ValiService();
