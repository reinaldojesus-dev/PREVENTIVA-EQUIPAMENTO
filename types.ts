
export enum EquipmentType {
  NONE = 'NONE',
  CANCELA = 'CANCELA',
  TERMINAL = 'TERMINAL',
  CAIXA = 'CAIXA',
  PDV = 'PDV',
  EPA = 'EPA',
  OUTROS = 'OUTROS',
}

export interface BaseChecklist {
    repairNeeded: boolean;
    repairDescription: string;
    internalPhoto?: string;
    internalPhotoName?: string;
    externalPhoto?: string;
    externalPhotoName?: string;
}

export interface CancelaChecklist {
  limpezaPlaca: boolean;
  lubrificacaoMecanismos: boolean;
  organizacaoCabos: boolean;
  fixacaoPasteis: boolean;
}

export interface TerminalChecklist {
  terminalName: string;
  limpezaPlacas: boolean;
  limpezaImpressora: boolean;
  organizacaoCabos: boolean;
  testeVoltagem: boolean;
  limpezaLeitor: boolean;
}

export interface EpaChecklist {
  epaName: string;
  limpezaMiniPC: boolean;
  limpezaImpressora: boolean;
  organizacaoCabos: boolean;
  testeVoltagem: boolean;
  limpezaLeitor: boolean;
  calibragemMonitor: boolean;
}

export interface FormData extends BaseChecklist {
  unit: string;
  city: string;
  equipmentType: EquipmentType;
  otherEquipmentName: string;
  checklist: Partial<CancelaChecklist & TerminalChecklist & EpaChecklist>;
}
