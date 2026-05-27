const VALID_MOTIVOS = ['Consultoría', 'Colaboración', 'Docencia', 'Otro'] as const;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContactForm(body: unknown): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!body || typeof body !== 'object') {
    return { valid: false, errors: { form: 'Invalid request body' } };
  }

  const data = body as Record<string, unknown>;

  // nombre: required, max 100
  if (!data.nombre || typeof data.nombre !== 'string' || data.nombre.trim().length === 0) {
    errors.nombre = 'El nombre es obligatorio';
  } else if (data.nombre.length > 100) {
    errors.nombre = 'El nombre no puede exceder 100 caracteres';
  }

  // email: required, max 150, valid format
  if (!data.email || typeof data.email !== 'string' || data.email.trim().length === 0) {
    errors.email = 'El email es obligatorio';
  } else if (data.email.length > 150) {
    errors.email = 'El email no puede exceder 150 caracteres';
  } else if (!EMAIL_REGEX.test(data.email)) {
    errors.email = 'El formato del email no es válido';
  }

  // motivo: required, must be one of valid options
  if (!data.motivo || typeof data.motivo !== 'string') {
    errors.motivo = 'El motivo es obligatorio';
  } else if (!VALID_MOTIVOS.includes(data.motivo as (typeof VALID_MOTIVOS)[number])) {
    errors.motivo = 'El motivo seleccionado no es válido';
  }

  // mensaje: required, max 1000
  if (!data.mensaje || typeof data.mensaje !== 'string' || data.mensaje.trim().length === 0) {
    errors.mensaje = 'El mensaje es obligatorio';
  } else if (data.mensaje.length > 1000) {
    errors.mensaje = 'El mensaje no puede exceder 1000 caracteres';
  }

  // empresa: optional, max 100
  if (data.empresa !== undefined && data.empresa !== null && data.empresa !== '') {
    if (typeof data.empresa !== 'string') {
      errors.empresa = 'La empresa debe ser texto';
    } else if (data.empresa.length > 100) {
      errors.empresa = 'La empresa no puede exceder 100 caracteres';
    }
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
