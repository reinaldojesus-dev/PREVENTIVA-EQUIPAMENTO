import React, { useState, useEffect, useRef } from 'react';
import { EquipmentType, FormData, TerminaisChecklist, CancelasChecklist, CamerasCftvChecklist, CaixaEpaChecklist, RackCpdChecklist } from './types';

// Type declarations for window-injected libraries
declare global {
  interface Window {
    jspdf: any;
    html2canvas: any;
  }
}

// --- SVG Icon Components (defined outside the main component) ---
const FileTextIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>
);

const WhatsappIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.225.651 4.315 1.731 6.086l.001.004 1.796 1.447-.936 3.42zM8.332 9.516c-.352-.176-.653-.195-.884-.195-.246 0-.472-.019-.68.116-.237.152-.563.538-.68.885-.116.347-.116.653-.116.92 0 .266.019.514.237.732.218.218.67.897 1.484 1.711 1.107 1.107 2.026 1.848 2.52 2.193.347.237.653.374.92.49.268.117.654.176 1.024.117.412-.058.937-.352 1.155-.957.218-.604.218-1.137.158-1.254-.059-.117-.218-.176-.455-.313-.237-.136-.563-.313-.884-.45-321-.137-.544-.195-.68-.433-.136-.237-.136-.562 0-.798.117-.218.276-.353.455-.47.179-.117.358-.217.517-.313.179-.117.218-.177.297-.294.08-.117.02-.236-.058-.353-.078-.117-1.004-2.438-1.382-3.33-.379-.892-.718-1.042-.957-1.042-.218 0-.455.02-.633.02z"/></svg>
);
const UploadCloudIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path><path d="M12 12v9"></path><path d="m16 16-4-4-4 4"></path></svg>
);
const CheckSquareIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
);
const SquareIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="3" rx="2"></rect></svg>
);
const SaveIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
);
const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
);
const Trash2Icon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
);

// --- Reusable UI Components ---
interface AutocompleteInputProps {
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    suggestions: string[];
    placeholder: string;
}
const AutocompleteInput: React.FC<AutocompleteInputProps> = ({ name, value, onChange, suggestions, placeholder }) => {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const filteredSuggestions = suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase())
    );

    const handleSelect = (suggestion: string) => {
        const fakeEvent = {
            target: { name, value: suggestion }
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(fakeEvent);
        setShowSuggestions(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);
    
    return (
        <div className="relative" ref={wrapperRef}>
            <input
                type="text"
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onFocus={() => setShowSuggestions(true)}
                autoComplete="off"
                className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-green-500 focus:border-green-500"
            />
            {showSuggestions && value && filteredSuggestions.length > 0 && (
                <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredSuggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            onClick={() => handleSelect(suggestion)}
                            className="p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};


interface CheckboxProps {
    label: string;
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    name: string;
}
const CheckboxItem: React.FC<CheckboxProps> = ({ label, checked, onChange, name }) => (
    <label className="flex items-start space-x-3 cursor-pointer group">
        <input type="checkbox" name={name} checked={checked} onChange={onChange} className="hidden" />
        <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-md border-2 border-gray-300 dark:border-gray-600 group-hover:border-green-500 transition-colors mt-0.5">
            {checked && <CheckSquareIcon className="w-5 h-5 text-green-600 dark:text-green-500" />}
            {!checked && <SquareIcon className="w-5 h-5 text-gray-300 dark:text-gray-600" />}
        </div>
        <span className={`text-gray-700 dark:text-gray-300 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors ${checked ? 'font-semibold text-gray-800 dark:text-gray-100' : ''}`}>
            {label}
        </span>
    </label>
);

interface FileInputProps {
    label: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemove: () => void;
    fileName?: string;
    previewUrl?: string;
}
const FileInput: React.FC<FileInputProps> = ({ label, onChange, onRemove, fileName, previewUrl }) => (
    <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label>
        {previewUrl ? (
            <div className="relative group border border-gray-300 dark:border-gray-700 rounded-lg p-2 bg-gray-50 dark:bg-gray-800/50">
                <img src={previewUrl} alt="Preview" className="w-full h-32 object-cover rounded-md" />
                <div className="absolute inset-2 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-colors flex items-center justify-center rounded-md">
                    <button 
                        type="button" 
                        onClick={onRemove} 
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        aria-label={`Remover ${label}`}
                    >
                        <Trash2Icon className="w-5 h-5" />
                    </button>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate mt-1 text-center font-medium">{fileName}</p>
            </div>
        ) : (
            <div className="mt-1">
                 <label htmlFor={label} className="relative cursor-pointer w-full flex flex-col items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-lg hover:border-green-500 dark:hover:border-green-400 transition-colors">
                    <input id={label} name={label} type="file" className="sr-only" onChange={onChange} accept="image/*" />
                    <div className="space-y-1 text-center">
                        <UploadCloudIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600 dark:text-gray-400">
                             <p className="font-medium text-green-600 dark:text-green-500">Clique para carregar</p>
                             <p className="pl-1">ou arraste e solte</p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-500">PNG, JPG até 10MB</p>
                    </div>
                </label>
            </div>
        )}
    </div>
);


// --- PDF Content Component (for rendering the report) ---
interface PdfContentProps {
    formData: FormData;
}

const getChecklistItemsForPdf = (formData: FormData): { label: string; checked: boolean }[] => {
    const { equipmentType, checklist } = formData;
    if (!equipmentType || equipmentType === EquipmentType.NONE) return [];

    const allChecklists = {
        [EquipmentType.TERMINAIS]: [
            { name: "limpezaGabinete", label: "1. Limpeza interna e externa do gabinete" },
            { name: "organizacaoCabosTerminais", label: "2. Organização dos cabeamentos" },
            { name: "limpezaImpressoraGuilhotina", label: "3. Limpeza da impressora e lubrificação da guilhotina" },
            { name: "limpezaLeitorTerminal", label: "4. Limpeza do leitor" },
            { name: "limpaContatoConexoes", label: "5. Limpeza com limpa contato nos conectores eletrônicos e placas" },
        ],
        [EquipmentType.CANCELAS]: [
            { name: "lubrificacaoEixoMotor", label: "1. Lubrificação do eixo do motor com graxa" },
            { name: "lubrificacaoPartesArticuladas", label: "2. Lubrificação das partes articuladas" },
            { name: "limpaContatoConexoesCancela", label: "3. Limpeza com limpa contato nos conectores eletrônicos e placas" },
        ],
        [EquipmentType.CAMERAS_CFTV]: [
            { name: "limpezaLenteCameras", label: "1. Limpeza da lente das câmeras" },
            { name: "verificarFocoPosicionamento", label: "2. Verificar foco e posicionamento" },
            { name: "organizacaoCabosCftv", label: "3. Organização dos cabos" },
            { name: "ajustarHorarioPdv", label: "4. Verificar/ ajustar o horário com o do PDV" },
            { name: "ajustarNomenclaturaNvr", label: "5. Verificar/ ajustar Nomenclatura das câmeras do NVR" },
        ],
        [EquipmentType.CAIXA]: [
            { name: "verificarImagemPadrao", label: "1. Verificar se está com a imagem padrão" },
            { name: "limpezaMiniPC", label: "2. Limpeza interna do MINI PC" },
            { name: "organizacaoCabosCaixa", label: "3. Organização dos cabeamentos" },
            { name: "testeNobreak", label: "4. Teste do nobreak, se não tiver, solicitar chamado para a compra" },
            { name: "limpezaArquivosTemporarios", label: "5. Limpeza dos arquivos temporários (Pasta %temp%)" },
            { name: "verificarVersaoPdv", label: "6. Verificar/atualizar a versão do PDV" },
            { name: "checagemAcessosRemotos", label: "7. Checagem dos Usuários e acessos remotos. (VNC e TS)" },
            { name: "verificarNomeMaquina", label: "8. Verificar se o nome da máquina está correto" },
        ],
        [EquipmentType.EPA]: [
            { name: "verificarImagemPadrao", label: "1. Verificar se está com a imagem padrão" },
            { name: "limpezaMiniPC", label: "2. Limpeza interna do MINI PC" },
            { name: "organizacaoCabosCaixa", label: "3. Organização dos cabeamentos" },
            { name: "testeNobreak", label: "4. Teste do nobreak, se não tiver, solicitar chamado para a compra" },
            { name: "limpezaArquivosTemporarios", label: "5. Limpeza dos arquivos temporários (Pasta %temp%)" },
            { name: "verificarVersaoPdv", label: "6. Verificar/atualizar a versão do EPA" },
            { name: "checagemAcessosRemotos", label: "7. Checagem dos Usuários e acessos remotos. (VNC e TS)" },
            { name: "verificarNomeMaquina", label: "8. Verificar se o nome da máquina está correto" },
        ],
        [EquipmentType.RACK_CPD]: [
            { name: "limpezaOrganizacaoCabosRack", label: "1. Limpeza e organização dos cabos" },
            { name: "remocaoCabosDiretoSwitch", label: "2. Remoção de cabos direto em switch (Utilizar patch painel quando necessário)" },
            { name: "atualizacaoPsIs", label: "3. Atualização PS e IS" },
            { name: "backupBancoDadosImagem", label: "4. Backup banco de dados e Imagem do sistema (WPS ou LINK)" },
            { name: "testarNobreaksRack", label: "5. Testar os nobreaks" },
        ]
    };
    
    const items = allChecklists[equipmentType] || [];
    // @ts-ignore
    return items.map(item => ({ label: item.label, checked: !!checklist[item.name] }));
};


const PdfContent = React.forwardRef<HTMLDivElement, PdfContentProps>(({ formData }, ref) => {
    const checklistItems = getChecklistItemsForPdf(formData);
    const hasPhotos = formData.beforeInternalPhoto || formData.beforeExternalPhoto || formData.internalPhoto || formData.externalPhoto;

    return (
    <div ref={ref} className="p-6 bg-white text-black font-sans" style={{ width: '8.5in' }}>
        <header className="text-center mb-4">
            <h1 className="text-xl font-bold text-gray-800">Relatório de Manutenção Preventiva</h1>
        </header>

        <section className="mb-4 pb-2 border-b border-gray-300">
            <h2 className="text-base font-bold text-gray-800 mb-2">Identificação</h2>
            <div className="text-xs space-y-1">
                <div className="flex justify-between">
                    <p><strong>Analista:</strong> {formData.collaboratorName || 'Não informado'}</p>
                    <p><strong>Data e Hora:</strong> {new Date(formData.date).toLocaleString('pt-BR')}</p>
                </div>
                <div className="flex justify-between">
                    <p><strong>Unidade:</strong> {formData.unit || 'Não informado'}</p>
                    <p><strong>Cidade:</strong> {formData.city || 'Não informada'}</p>
                </div>
            </div>
        </section>

        <section className="mb-4 pb-2 border-b border-gray-300">
            <h2 className="text-base font-bold text-gray-800 mb-2">Detalhes do Equipamento</h2>
            <div className="text-xs grid grid-cols-2 gap-x-6">
                <p><strong>Tipo:</strong> {formData.equipmentType}</p>
                 {formData.locationName && (
                    <p><strong>Local/Nome:</strong> {formData.locationName}</p>
                )}
                {(formData.equipmentType === EquipmentType.TERMINAIS || formData.equipmentType === EquipmentType.CANCELAS) && formData.terminalLaneType && (
                    <p><strong>Pista:</strong> {formData.terminalLaneType}</p>
                )}
                {formData.equipmentType === EquipmentType.OUTROS && formData.otherEquipmentName &&(
                    <p><strong>Equipamento:</strong> {formData.otherEquipmentName}</p>
                )}
            </div>
        </section>
        
        <section className="mb-4">
            <h2 className="text-base font-bold text-gray-800 mb-2">Checklist de Verificação</h2>
            {checklistItems.length > 0 ? (
                <ul className="list-none space-y-1 text-xs">
                    {checklistItems.map(item => (
                        <li key={item.label} className="flex items-center">
                            <span className={`inline-block w-3 h-3 mr-2 border ${item.checked ? 'bg-green-500 border-green-700' : 'bg-white border-gray-400'}`}></span>
                            <span>{item.label}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-xs text-gray-500">Nenhum item de verificação aplicável.</p>
            )}
        </section>
        
        <section className="mb-4">
            <h2 className="text-base font-bold text-gray-800 mb-2">Necessidade de Reparo</h2>
            <p className="text-xs"><strong>Precisa de Reparo/Reposição:</strong> {formData.repairNeeded ? 'Sim' : 'Não'}</p>
            {formData.repairNeeded && (
                <div className="mt-1 p-2 border border-gray-200 rounded-md bg-gray-50">
                    <p className="text-xs"><strong>Descrição:</strong> {formData.repairDescription}</p>
                </div>
            )}
        </section>

        <section>
            <h2 className="text-base font-bold text-gray-800 mb-2">Fotos Anexadas</h2>
            {hasPhotos ? (
                <div className="grid grid-cols-2 gap-4">
                    {formData.beforeInternalPhoto && (
                        <div>
                            <h3 className="font-semibold text-center text-xs mb-1">Interna (Antes)</h3>
                            <img src={formData.beforeInternalPhoto} alt="Foto Interna Antes" className="w-full h-64 object-cover border border-gray-300 rounded"/>
                        </div>
                    )}
                    {formData.beforeExternalPhoto && (
                        <div>
                            <h3 className="font-semibold text-center text-xs mb-1">Externa (Antes)</h3>
                            <img src={formData.beforeExternalPhoto} alt="Foto Externa Antes" className="w-full h-64 object-cover border border-gray-300 rounded"/>
                        </div>
                    )}
                    {formData.internalPhoto && (
                        <div>
                            <h3 className="font-semibold text-center text-xs mb-1">Interna (Depois)</h3>
                            <img src={formData.internalPhoto} alt="Foto Interna Depois" className="w-full h-64 object-cover border border-gray-300 rounded"/>
                        </div>
                    )}
                    {formData.externalPhoto && (
                        <div>
                            <h3 className="font-semibold text-center text-xs mb-1">Externa (Depois)</h3>
                            <img src={formData.externalPhoto} alt="Foto Externa Depois" className="w-full h-64 object-cover border border-gray-300 rounded"/>
                        </div>
                    )}
                </div>
            ) : (
                <p className="text-xs text-gray-500">Nenhuma foto anexada.</p>
            )}
        </section>
    </div>
)});


// --- Main App Component ---

const App: React.FC = () => {
    const initialFormData: FormData = {
        id: 0,
        savedAt: 0,
        collaboratorName: '',
        date: new Date().toISOString(),
        unit: '',
        city: '',
        equipmentType: EquipmentType.NONE,
        terminalLaneType: '',
        locationName: '',
        otherEquipmentName: '',
        checklist: {},
        beforeInternalPhoto: undefined,
        beforeInternalPhotoName: '',
        beforeExternalPhoto: undefined,
        beforeExternalPhotoName: '',
        internalPhoto: undefined,
        internalPhotoName: '',
        externalPhoto: undefined,
        externalPhotoName: '',
        repairNeeded: false,
        repairDescription: '',
    };

    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [savedChecklists, setSavedChecklists] = useState<FormData[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [pdfData, setPdfData] = useState<FormData>(initialFormData);
    const [analystSuggestions, setAnalystSuggestions] = useState<string[]>([]);
    const [unitSuggestions, setUnitSuggestions] = useState<string[]>([]);
    const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
    const formRef = useRef<HTMLDivElement>(null);
    const pdfRef = useRef<HTMLDivElement>(null);

    // Load history and suggestions from localStorage on initial render
    useEffect(() => {
        try {
            const history = localStorage.getItem('checklistHistory');
            if (history) setSavedChecklists(JSON.parse(history));
            
            const analysts = localStorage.getItem('preventiveAnalystNames');
            if (analysts) setAnalystSuggestions(JSON.parse(analysts));

            const units = localStorage.getItem('preventiveUnitNames');
            if (units) setUnitSuggestions(JSON.parse(units));
            
            const cities = localStorage.getItem('preventiveCityNames');
            if (cities) setCitySuggestions(JSON.parse(cities));

        } catch (error) {
            console.error("Failed to load data from localStorage", error);
        }
    }, []);
    
    // Autosave current form data to sync with the PDF generation data state
    useEffect(() => {
        setPdfData(formData);
        try {
            localStorage.setItem('preventiveFormData', JSON.stringify(formData));
        } catch (error) {
            console.error("Failed to save session to localStorage", error);
        }
    }, [formData]);
    
    const updateSuggestions = (key: string, value: string, suggestions: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
        if (!value) return;
        const lowerCaseValue = value.toLowerCase();
        const suggestionExists = suggestions.some(s => s.toLowerCase() === lowerCaseValue);

        if (!suggestionExists) {
            const newSuggestions = [value, ...suggestions].slice(0, 15);
            setter(newSuggestions);
            localStorage.setItem(key, JSON.stringify(newSuggestions));
        }
    };

    const generateUniqueId = (): number => {
        let newId = 0;
        let isUnique = false;
        while (!isUnique) {
            newId = Math.floor(Math.random() * 1_000_000_000);
            if (!savedChecklists.some(c => c.id === newId)) {
                isUnique = true;
            }
        }
        return newId;
    };

    const handleSaveData = () => {
        if (!formData.collaboratorName) {
            alert("Por favor, preencha o Nome do Analista.");
            return;
        }

        if (!formData.unit || !formData.equipmentType || formData.equipmentType === EquipmentType.NONE) {
            alert('Por favor, preencha pelo menos a Unidade e o Tipo de Equipamento antes de salvar.');
            return;
        }

        try {
            let history: FormData[] = [...savedChecklists];

            // If formData has an ID, it's an update.
            if (formData.id !== 0) {
                const updatedChecklist = { ...formData, savedAt: Date.now() };
                history = history.map(c => c.id === formData.id ? updatedChecklist : c);
                alert('Checklist atualizado com sucesso!');
            } else { // Otherwise, it's a new entry.
                const newChecklist = { 
                    ...formData, 
                    id: generateUniqueId(),
                    savedAt: Date.now() 
                };
                history.unshift(newChecklist);
                 alert('Checklist salvo com sucesso na lista de recentes!');
            }
            
            // Update suggestions
            updateSuggestions('preventiveAnalystNames', formData.collaboratorName, analystSuggestions, setAnalystSuggestions);
            updateSuggestions('preventiveUnitNames', formData.unit, unitSuggestions, setUnitSuggestions);
            updateSuggestions('preventiveCityNames', formData.city, citySuggestions, setCitySuggestions);

            // Sort by savedAt date and limit the list size
            history.sort((a, b) => b.savedAt - a.savedAt);
            const limitedHistory = history.slice(0, 5);

            localStorage.setItem('checklistHistory', JSON.stringify(limitedHistory));
            setSavedChecklists(limitedHistory);


            // Reset equipment-related fields for the next entry, keeping identification data
            setFormData(prev => ({
                ...initialFormData,
                date: new Date().toISOString(),
                collaboratorName: prev.collaboratorName,
                unit: prev.unit,
                city: prev.city,
            }));
            
        } catch (error) {
            console.error("Failed to save checklist to history", error);
            alert('Falha ao salvar o checklist.');
        }
    };

    const handleLoadChecklist = (id: number) => {
        const checklistToLoad = savedChecklists.find(c => c.id === id);
        if (checklistToLoad) {
            setFormData(checklistToLoad);
            window.scrollTo(0, 0);
            alert('Checklist carregado para edição!');
        }
    };

    const handleDeleteChecklist = (id: number) => {
        if (window.confirm('Tem certeza que deseja remover este checklist salvo?')) {
            try {
                const updatedHistory = savedChecklists.filter(c => c.id !== id);
                localStorage.setItem('checklistHistory', JSON.stringify(updatedHistory));
                setSavedChecklists(updatedHistory);
                alert('Checklist removido com sucesso.');
            } catch (error) {
                 console.error("Failed to delete checklist from history", error);
                 alert('Falha ao remover o checklist.');
            }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        if (name === 'repairNeeded') {
            setFormData(prev => ({
                ...prev,
                repairNeeded: checked,
                repairDescription: checked ? prev.repairDescription : ''
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                checklist: { ...prev.checklist, [name]: checked }
            }));
        }
    };
    
    const handleEquipmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newType = e.target.value as EquipmentType;
        setFormData(prev => ({
            ...initialFormData,
            date: new Date().toISOString(),
            collaboratorName: prev.collaboratorName,
            unit: prev.unit,
            city: prev.city,
            equipmentType: newType,
        }));
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'internalPhoto' | 'externalPhoto' | 'beforeInternalPhoto' | 'beforeExternalPhoto') => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    [field]: reader.result as string,
                    [`${field}Name`]: file.name,
                }));
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleFileRemove = (field: 'internalPhoto' | 'externalPhoto' | 'beforeInternalPhoto' | 'beforeExternalPhoto') => {
        setFormData(prev => ({
            ...prev,
            [field]: undefined,
            [`${field}Name`]: '',
        }));
    };

    const handleGeneratePdf = async () => {
        if (!window.html2canvas || !window.jspdf) {
            alert("Erro: As bibliotecas de geração de PDF não foram carregadas. Verifique sua conexão com a internet e tente novamente.");
            return;
        }
        if (!pdfRef.current) {
            alert("Erro: O elemento do relatório não foi encontrado. Tente recarregar a página.");
            return;
        }
        
        setIsGenerating(true);
        try {
            const { jsPDF } = window.jspdf;
            const canvas = await window.html2canvas(pdfRef.current, { 
                scale: 2, 
                backgroundColor: '#ffffff',
                useCORS: true,
            });
            const imgData = canvas.toDataURL('image/png');
            
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'pt',
                format: 'a4'
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const canvasAspectRatio = canvasWidth / canvasHeight;

            let imgWidth = pdfWidth;
            let imgHeight = pdfWidth / canvasAspectRatio;

            if (imgHeight > pdfHeight) {
                imgHeight = pdfHeight;
                imgWidth = pdfHeight * canvasAspectRatio;
            }

            const xOffset = (pdfWidth - imgWidth) / 2;
            const yOffset = (pdfHeight - imgHeight) / 2;

            pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight);
            pdf.save(`preventiva_${pdfData.unit || 'unidade'}_${pdfData.equipmentType}.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Ocorreu um erro ao gerar o PDF. Verifique o console para mais detalhes.");
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleSendWhatsapp = async () => {
        if (!window.html2canvas || !window.jspdf) {
            alert("Erro: As bibliotecas de geração de PDF não foram carregadas. Verifique sua conexão com a internet e tente novamente.");
            return;
        }
        if (!pdfRef.current) {
            alert("Erro: O elemento do relatório não foi encontrado. Tente recarregar a página.");
            return;
        }
        if (!navigator.share) {
            alert('Seu navegador não suporta a função de compartilhamento. Por favor, tente em um navegador móvel ou use a opção de gerar PDF.');
            return;
        }
    
        setIsGenerating(true);
        try {
            const { jsPDF } = window.jspdf;
            const canvas = await window.html2canvas(pdfRef.current, { 
                scale: 2, 
                backgroundColor: '#ffffff',
                useCORS: true,
            });
            const imgData = canvas.toDataURL('image/png');
            
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'pt',
                format: 'a4'
            });
    
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const canvasAspectRatio = canvasWidth / canvasHeight;
    
            let imgWidth = pdfWidth;
            let imgHeight = pdfWidth / canvasAspectRatio;
    
            if (imgHeight > pdfHeight) {
                imgHeight = pdfHeight;
                imgWidth = pdfHeight * canvasAspectRatio;
            }
    
            const xOffset = (pdfWidth - imgWidth) / 2;
            const yOffset = (pdfHeight - imgHeight) / 2;
    
            pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight);
            
            const blob = pdf.output('blob');
            
            if (!blob) {
                throw new Error("Falha na conversão do relatório para PDF.");
            }
    
            const fileName = `preventiva_${pdfData.unit || 'unidade'}_${pdfData.equipmentType}.pdf`;
            const file = new File([blob], fileName, { type: 'application/pdf' });
            
            const shareData = {
                files: [file],
                title: `Preventiva: ${pdfData.unit || 'Unidade'}`,
                text: `Checklist de manutenção preventiva para ${pdfData.equipmentType} na unidade ${pdfData.unit}.`
            };
            
            if (navigator.canShare && !navigator.canShare({ files: [file] })) {
                alert('Seu navegador não suporta o compartilhamento de arquivos PDF.');
                setIsGenerating(false);
                return;
            }
            
            await navigator.share(shareData);
    
        } catch (error: any) {
            if (error.name !== 'AbortError') { // User cancellation is not an error
                 console.error("Erro ao compartilhar o PDF:", error);
                 alert("Ocorreu um erro ao tentar compartilhar o PDF. Verifique o console para mais detalhes.");
            }
        } finally {
            setIsGenerating(false);
        }
    };
    
    const generatePdfForItem = (item: FormData) => {
        setPdfData(item);
        setTimeout(() => {
            handleGeneratePdf();
        }, 100);
    };

    const sendWhatsappForItem = (item: FormData) => {
        setPdfData(item);
        setTimeout(() => {
            handleSendWhatsapp();
        }, 100);
    };

    const renderChecklist = () => {
        const { checklist } = formData;

        const renderSection = (title: string, children: React.ReactNode) => (
            <div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">{title}</h3>
                <div className="space-y-4 pl-4 border-l-2 border-green-500">
                    {children}
                </div>
            </div>
        );

        switch (formData.equipmentType) {
            case EquipmentType.TERMINAIS:
                const terminaisData = checklist as Partial<TerminaisChecklist>;
                return renderSection("Checklist de Terminal",
                    <>
                        <CheckboxItem name="limpezaGabinete" label="1. Limpeza interna e externa do gabinete" checked={!!terminaisData.limpezaGabinete} onChange={handleCheckboxChange} />
                        <CheckboxItem name="organizacaoCabosTerminais" label="2. Organização dos cabeamentos" checked={!!terminaisData.organizacaoCabosTerminais} onChange={handleCheckboxChange} />
                        <CheckboxItem name="limpezaImpressoraGuilhotina" label="3. Limpeza da impressora e lubrificação da guilhotina" checked={!!terminaisData.limpezaImpressoraGuilhotina} onChange={handleCheckboxChange} />
                        <CheckboxItem name="limpezaLeitorTerminal" label="4. Limpeza do leitor" checked={!!terminaisData.limpezaLeitorTerminal} onChange={handleCheckboxChange} />
                        <CheckboxItem name="limpaContatoConexoes" label="5. Limpeza com limpa contato nos conectores eletrônicos e placas" checked={!!terminaisData.limpaContatoConexoes} onChange={handleCheckboxChange} />
                    </>
                );

            case EquipmentType.CANCELAS:
                const cancelasData = checklist as Partial<CancelasChecklist>;
                return renderSection("Checklist de Cancela",
                    <>
                        <CheckboxItem name="lubrificacaoEixoMotor" label="1. Lubrificação do eixo do motor com graxa" checked={!!cancelasData.lubrificacaoEixoMotor} onChange={handleCheckboxChange} />
                        <CheckboxItem name="lubrificacaoPartesArticuladas" label="2. Lubrificação das partes articuladas" checked={!!cancelasData.lubrificacaoPartesArticuladas} onChange={handleCheckboxChange} />
                        <CheckboxItem name="limpaContatoConexoesCancela" label="3. Limpeza com limpa contato nos conectores eletrônicos e placas" checked={!!cancelasData.limpaContatoConexoesCancela} onChange={handleCheckboxChange} />
                    </>
                );

            case EquipmentType.CAMERAS_CFTV:
                const camerasCftvData = checklist as Partial<CamerasCftvChecklist>;
                return renderSection("Checklist de Câmeras / CFTV",
                    <>
                        <CheckboxItem name="limpezaLenteCameras" label="1. Limpeza da lente das câmeras" checked={!!camerasCftvData.limpezaLenteCameras} onChange={handleCheckboxChange} />
                        <CheckboxItem name="verificarFocoPosicionamento" label="2. Verificar foco e posicionamento" checked={!!camerasCftvData.verificarFocoPosicionamento} onChange={handleCheckboxChange} />
                        <CheckboxItem name="organizacaoCabosCftv" label="3. Organização dos cabos" checked={!!camerasCftvData.organizacaoCabosCftv} onChange={handleCheckboxChange} />
                        <CheckboxItem name="ajustarHorarioPdv" label="4. Verificar/ ajustar o horário com o do PDV" checked={!!camerasCftvData.ajustarHorarioPdv} onChange={handleCheckboxChange} />
                        <CheckboxItem name="ajustarNomenclaturaNvr" label="5. Verificar/ ajustar Nomenclatura das câmeras do NVR" checked={!!camerasCftvData.ajustarNomenclaturaNvr} onChange={handleCheckboxChange} />
                    </>
                );


            case EquipmentType.CAIXA:
            case EquipmentType.EPA:
                const caixaEpaData = checklist as Partial<CaixaEpaChecklist>;
                const sectionTitle = `Checklist de ${formData.equipmentType}`;
                const versionLabel = formData.equipmentType === EquipmentType.CAIXA
                    ? "6. Verificar/atualizar a versão do PDV"
                    : "6. Verificar/atualizar a versão do EPA";

                return renderSection(sectionTitle,
                    <>
                        <CheckboxItem name="verificarImagemPadrao" label="1. Verificar se está com a imagem padrão" checked={!!caixaEpaData.verificarImagemPadrao} onChange={handleCheckboxChange} />
                        <CheckboxItem name="limpezaMiniPC" label="2. Limpeza interna do MINI PC" checked={!!caixaEpaData.limpezaMiniPC} onChange={handleCheckboxChange} />
                        <CheckboxItem name="organizacaoCabosCaixa" label="3. Organização dos cabeamentos" checked={!!caixaEpaData.organizacaoCabosCaixa} onChange={handleCheckboxChange} />
                        <CheckboxItem name="testeNobreak" label="4. Teste do nobreak, se não tiver, solicitar chamado para a compra" checked={!!caixaEpaData.testeNobreak} onChange={handleCheckboxChange} />
                        <CheckboxItem name="limpezaArquivosTemporarios" label="5. Limpeza dos arquivos temporários (Pasta %temp%)" checked={!!caixaEpaData.limpezaArquivosTemporarios} onChange={handleCheckboxChange} />
                        <CheckboxItem name="verificarVersaoPdv" label={versionLabel} checked={!!caixaEpaData.verificarVersaoPdv} onChange={handleCheckboxChange} />
                        <CheckboxItem name="checagemAcessosRemotos" label="7. Checagem dos Usuários e acessos remotos. (VNC e TS)" checked={!!caixaEpaData.checagemAcessosRemotos} onChange={handleCheckboxChange} />
                        <CheckboxItem name="verificarNomeMaquina" label="8. Verificar se o nome da máquina está correto" checked={!!caixaEpaData.verificarNomeMaquina} onChange={handleCheckboxChange} />
                    </>
                );

            case EquipmentType.RACK_CPD:
                const rackCpdData = checklist as Partial<RackCpdChecklist>;
                return renderSection("Checklist de Rack (CPD)",
                    <>
                        <CheckboxItem name="limpezaOrganizacaoCabosRack" label="1. Limpeza e organização dos cabos" checked={!!rackCpdData.limpezaOrganizacaoCabosRack} onChange={handleCheckboxChange} />
                        <CheckboxItem name="remocaoCabosDiretoSwitch" label="2. Remoção de cabos direto em switch (Utilizar patch painel quando necessário)" checked={!!rackCpdData.remocaoCabosDiretoSwitch} onChange={handleCheckboxChange} />
                        <CheckboxItem name="atualizacaoPsIs" label="3. Atualização PS e IS" checked={!!rackCpdData.atualizacaoPsIs} onChange={handleCheckboxChange} />
                        <CheckboxItem name="backupBancoDadosImagem" label="4. Backup banco de dados e Imagem do sistema (WPS ou LINK)" checked={!!rackCpdData.backupBancoDadosImagem} onChange={handleCheckboxChange} />
                        <CheckboxItem name="testarNobreaksRack" label="5. Testar os nobreaks" checked={!!rackCpdData.testarNobreaksRack} onChange={handleCheckboxChange} />
                    </>
                );
            default:
                return <p className="text-gray-500 dark:text-gray-400">Selecione um tipo de equipamento para ver o checklist.</p>;
        }
    };
    
    return (
        <div className="min-h-screen text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8">
            <main className="max-w-4xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Preventiva de Equipamento</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">Formulário de Checklist de Manutenção</p>
                </header>
                
                <div ref={formRef} className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg">
                    <div className="space-y-8">
                        {/* Section 1: Identification */}
                        <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
                            <h2 className="text-xl font-semibold mb-4 border-b pb-2 border-gray-200 dark:border-gray-800">Identificação</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <AutocompleteInput name="collaboratorName" placeholder="Nome do Analista" value={formData.collaboratorName} onChange={handleInputChange} suggestions={analystSuggestions} />
                                <div className="w-full p-3 bg-gray-100 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-md">
                                    <p className="text-gray-700 dark:text-gray-300">{new Date(formData.date).toLocaleString('pt-BR')}</p>
                                </div>
                                <AutocompleteInput name="unit" placeholder="Unidade (Ex: Nome da Garagem)" value={formData.unit} onChange={handleInputChange} suggestions={unitSuggestions} />
                                <AutocompleteInput name="city" placeholder="Cidade (Opcional)" value={formData.city} onChange={handleInputChange} suggestions={citySuggestions} />
                            </div>
                        </div>

                        {/* Section 2: Equipment */}
                        <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
                             <h2 className="text-xl font-semibold mb-4 border-b pb-2 border-gray-200 dark:border-gray-800">Adicione o Equipamento</h2>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <select name="equipmentType" value={formData.equipmentType} onChange={handleEquipmentChange} className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-green-500 focus:border-green-500">
                                    <option value={EquipmentType.NONE} disabled>Selecione o tipo...</option>
                                    <option value={EquipmentType.TERMINAIS}>Terminal</option>
                                    <option value={EquipmentType.CANCELAS}>Cancela</option>
                                    <option value={EquipmentType.CAMERAS_CFTV}>Câmeras / CFTV</option>
                                    <option value={EquipmentType.CAIXA}>Caixa</option>
                                    <option value={EquipmentType.EPA}>EPA</option>
                                    <option value={EquipmentType.RACK_CPD}>Rack (CPD)</option>
                                    <option value={EquipmentType.OUTROS}>Outros</option>
                                </select>
                                
                                {(formData.equipmentType === EquipmentType.TERMINAIS || formData.equipmentType === EquipmentType.CANCELAS) ? (
                                    <select name="terminalLaneType" value={formData.terminalLaneType} onChange={handleInputChange} className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-green-500 focus:border-green-500">
                                        <option value="">Selecione o tipo de pista...</option>
                                        <option value="Entrada">Entrada</option>
                                        <option value="Saída">Saída</option>
                                    </select>
                                ) : formData.equipmentType === EquipmentType.OUTROS ? (
                                    <input type="text" name="otherEquipmentName" placeholder="Informe o equipamento" value={formData.otherEquipmentName} onChange={handleInputChange} className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-green-500 focus:border-green-500" />
                                ) : (
                                    <div /> // Placeholder to keep grid alignment
                                )}

                                {formData.equipmentType !== EquipmentType.NONE && (
                                    <input
                                        type="text"
                                        name="locationName"
                                        placeholder="Local/Nome Específico (Ex: Pista 1, Câmera da Fachada)"
                                        value={formData.locationName}
                                        onChange={handleInputChange}
                                        className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-green-500 focus:border-green-500 md:col-span-2"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Section 3: Checklist */}
                        {formData.equipmentType !== EquipmentType.NONE && (
                           <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
                                <h2 className="text-xl font-semibold mb-4 border-b pb-2 border-gray-200 dark:border-gray-800">Itens de Verificação</h2>
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Fotos Iniciais</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FileInput label="Foto Interna (Antes da Preventiva)" onChange={(e) => handleFileChange(e, 'beforeInternalPhoto')} onRemove={() => handleFileRemove('beforeInternalPhoto')} fileName={formData.beforeInternalPhotoName} previewUrl={formData.beforeInternalPhoto}/>
                                            <FileInput label="Foto Externa (Antes da Preventiva)" onChange={(e) => handleFileChange(e, 'beforeExternalPhoto')} onRemove={() => handleFileRemove('beforeExternalPhoto')} fileName={formData.beforeExternalPhotoName} previewUrl={formData.beforeExternalPhoto}/>
                                        </div>
                                    </div>
                                    <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
                                        {renderChecklist()}
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* Section 4: Repair and Photos */}
                        {formData.equipmentType !== EquipmentType.NONE && (
                            <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg space-y-6">
                                 <h2 className="text-xl font-semibold mb-4 border-b pb-2 border-gray-200 dark:border-gray-800">Reparos e Anexos Finais</h2>
                                <CheckboxItem name="repairNeeded" label="Precisa de reposição ou reparo?" checked={formData.repairNeeded} onChange={handleCheckboxChange} />
                                {formData.repairNeeded && (
                                    <textarea name="repairDescription" placeholder="Descreva as necessidades do equipamento..." value={formData.repairDescription} onChange={handleInputChange} rows={4} className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-green-500 focus:border-green-500"></textarea>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FileInput label="Foto Interna (Depois da Preventiva)" onChange={(e) => handleFileChange(e, 'internalPhoto')} onRemove={() => handleFileRemove('internalPhoto')} fileName={formData.internalPhotoName} previewUrl={formData.internalPhoto}/>
                                    <FileInput label="Foto Externa (Depois da Preventiva)" onChange={(e) => handleFileChange(e, 'externalPhoto')} onRemove={() => handleFileRemove('externalPhoto')} fileName={formData.externalPhotoName} previewUrl={formData.externalPhoto}/>
                                </div>
                                <div className="mt-6 flex justify-center">
                                    <button onClick={handleSaveData} className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900">
                                        <SaveIcon className="w-5 h-5"/> Salvar Checklist na Lista
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Section 6: Saved Checklists */}
                <div className="mt-8">
                    <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white mb-6">Últimos Checklists Salvos</h2>
                    {savedChecklists.length > 0 ? (
                        <div className="space-y-4">
                            {savedChecklists.map((checklist) => (
                                <div key={checklist.id} className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md flex items-center justify-between transition-all hover:shadow-lg">
                                    <div className="flex-grow">
                                        <p className="font-bold text-lg text-green-600 dark:text-green-400">{checklist.unit || 'Unidade não informada'}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {checklist.equipmentType}
                                            {checklist.locationName && ` (${checklist.locationName})`}
                                            {checklist.terminalLaneType && ` - Pista ${checklist.terminalLaneType}`}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-500">Salvo em: {new Date(checklist.savedAt).toLocaleString('pt-BR')}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => generatePdfForItem(checklist)} disabled={isGenerating} className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full transition-colors disabled:text-gray-400 disabled:cursor-not-allowed" title="Gerar PDF">
                                            <FileTextIcon className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => sendWhatsappForItem(checklist)} disabled={isGenerating} className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-full transition-colors disabled:text-gray-400 disabled:cursor-not-allowed" title="Enviar por WhatsApp">
                                            <WhatsappIcon className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => handleLoadChecklist(checklist.id)} disabled={isGenerating} className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-full transition-colors" title="Carregar Checklist">
                                            <DownloadIcon className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => handleDeleteChecklist(checklist.id)} disabled={isGenerating} className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full transition-colors" title="Remover Checklist">
                                            <Trash2Icon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400">Nenhum checklist salvo recentemente.</p>
                    )}
                </div>
            </main>

            {/* Off-screen component for PDF generation */}
            <div style={{ position: 'absolute', left: '-9999px', top: 0, zIndex: -1 }}>
                <PdfContent ref={pdfRef} formData={pdfData} />
            </div>
        </div>
    );
};

export default App;
