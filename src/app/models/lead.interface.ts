export interface Lead {
  id: number;
  nombre: string;
  empresa: string | null;
  email: string;
  motivo: 'Consultoría' | 'Colaboración' | 'Docencia' | 'Otro';
  mensaje: string;
  created_at: string;
  ip_hash: string;
}
