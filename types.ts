export enum EquipmentType {
  NONE = 'NONE',
  TERMINAIS = 'Terminal',
  CANCELAS = 'Cancela',
  CAMERAS_CFTV = 'Câmeras / CFTV',
  CAIXA = 'Caixa',
  EPA = 'EPA',
  RACK_CPD = 'Rack (CPD)',
  OUTROS = 'Outros',
}

export interface BaseChecklist {
    repairNeeded: boolean;
    repairDescription: string;
    internalPhoto?: string;
    internalPhotoName?: string;
    externalPhoto?: string;
    externalPhotoName?: string;
}

export interface TerminaisChecklist {
  limpezaGabinete: boolean;
  organizacaoCabosTerminais: boolean;
  limpezaImpressoraGuilhotina: boolean;
  limpezaLeitorTerminal: boolean;
  limpaContatoConexoes: boolean;
}

export interface CancelasChecklist {
  lubrificacaoEixoMotor: boolean;
  lubrificacaoPartesArticuladas: boolean;
  limpaContatoConexoesCancela: boolean;
}

export interface CamerasCftvChecklist {
  limpezaLenteCameras: boolean;
  verificarFocoPosicionamento: boolean;
  fotosDepoisCameras: boolean;
  organizacaoCabosCftv: boolean;
  ajustarHorarioPdv: boolean;
  ajustarNomenclaturaNvr: boolean;
}

export interface CaixaEpaChecklist {
  verificarImagemPadrao: boolean;
  limpezaMiniPC: boolean;
  organizacaoCabosCaixa: boolean;
  testeNobreak: boolean;
  limpezaArquivosTemporarios: boolean;
  verificarVersaoPdv: boolean;
  checagemAcessosRemotos: boolean;
  verificarNomeMaquina: boolean;
}

export interface RackCpdChecklist {
  limpezaOrganizacaoCabosRack: boolean;
  remocaoCabosDiretoSwitch: boolean;
  atualizacaoPsIs: boolean;
  backupBancoDadosImagem: boolean;
  testarNobreaksRack: boolean;
}


export interface FormData extends BaseChecklist {
  id: number;
  savedAt: number;
  collaboratorName: string;
  date: string;
  unit: string;
  city: string;
  equipmentType: EquipmentType;
  terminalLaneType: string;
  locationName: string;
  otherEquipmentName: string;
  checklist: Partial<TerminaisChecklist & CancelasChecklist & CamerasCftvChecklist & CaixaEpaChecklist & RackCpdChecklist>;
  beforeInternalPhoto?: string;
  beforeInternalPhotoName?: string;
  beforeExternalPhoto?: string;
  beforeExternalPhotoName?: string;
}