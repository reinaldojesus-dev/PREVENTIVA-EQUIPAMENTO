import React, { useState, useEffect, useRef, useCallback } from 'react';
import { EquipmentType, FormData, CancelaChecklist, TerminalChecklist, EpaChecklist } from './types';

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
const MailIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
);
const WhatsappIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.225.651 4.315 1.731 6.086l.001.004 1.796 1.447-.936 3.42zM8.332 9.516c-.352-.176-.653-.195-.884-.195-.246 0-.472-.019-.68.116-.237.152-.563.538-.68.885-.116.347-.116.653-.116.92 0 .266.019.514.237.732.218.218.67.897 1.484 1.711 1.107 1.107 2.026 1.848 2.52 2.193.347.237.653.374.92.49.268.117.654.176 1.024.117.412-.058.937-.352 1.155-.957.218-.604.218-1.137.158-1.254-.059-.117-.218-.176-.455-.313-.237-.136-.563-.313-.884-.45-321-.137-.544-.195-.68-.433-.136-.237-.136-.562 0-.798.117-.218.276-.353.455-.47.179-.117.358-.217.517-.313.179-.117.218-.177.297-.294.08-.117.02-.236-.058-.353-.078-.117-1.004-2.438-1.382-3.33-.379-.892-.718-1.042-.957-1.042-.218 0-.455.02-.633.02z"/></svg>
);
const RotateCwIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path><path d="M3 22v-6h6"></path><path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path></svg>
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


// --- Reusable UI Components ---

interface CheckboxProps {
    label: string;
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    name: string;
}
const CheckboxItem: React.FC<CheckboxProps> = ({ label, checked, onChange, name }) => (
    <label className="flex items-center space-x-3 cursor-pointer group">
        <input type="checkbox" name={name} checked={checked} onChange={onChange} className="hidden" />
        <div className="w-6 h-6 flex items-center justify-center rounded-md border-2 border-gray-300 dark:border-gray-600 group-hover:border-green-500 transition-colors">
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
    fileName?: string;
    previewUrl?: string;
}
const FileInput: React.FC<FileInputProps> = ({ label, onChange, fileName, previewUrl }) => (
    <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-md">
            <div className="space-y-1 text-center">
                {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="mx-auto h-24 w-auto rounded-md object-cover" />
                ) : (
                    <UploadCloudIcon className="mx-auto h-12 w-12 text-gray-400" />
                )}
                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                    <label htmlFor={label} className="relative cursor-pointer bg-white dark:bg-gray-900 rounded-md font-medium text-green-600 dark:text-green-500 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                        <span>Carregar um arquivo</span>
                        <input id={label} name={label} type="file" className="sr-only" onChange={onChange} accept="image/*" />
                    </label>
                    <p className="pl-1">ou arraste e solte</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-500">{fileName || "PNG, JPG até 10MB"}</p>
            </div>
        </div>
    </div>
);

// --- Main App Component ---

const App: React.FC = () => {
    const initialFormData: FormData = {
        unit: '',
        city: '',
        equipmentType: EquipmentType.NONE,
        otherEquipmentName: '',
        checklist: {},
        internalPhoto: undefined,
        internalPhotoName: '',
        externalPhoto: undefined,
        externalPhotoName: '',
        repairNeeded: false,
        repairDescription: '',
    };

    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [isGenerating, setIsGenerating] = useState(false);
    const formRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        try {
            localStorage.setItem('preventiveFormData', JSON.stringify(formData));
        } catch (error) {
            console.error("Failed to save to localStorage", error);
        }
    }, [formData]);

    const handleRestore = useCallback(() => {
        try {
            const savedData = localStorage.getItem('preventiveFormData');
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                // Clean up potential invalid file objects
                parsedData.internalPhoto = undefined;
                parsedData.externalPhoto = undefined;
                setFormData(parsedData);
                alert('Dados restaurados com sucesso!');
            } else {
                alert('Nenhum dado salvo encontrado.');
            }
        } catch (error) {
            console.error("Failed to restore from localStorage", error);
            alert('Falha ao restaurar os dados.');
        }
    }, []);

    const handleSaveData = () => {
        try {
            localStorage.setItem('preventiveFormData', JSON.stringify(formData));
            alert('Dados salvos com sucesso no dispositivo!');
        } catch (error) {
            console.error("Failed to save to localStorage", error);
            alert('Falha ao salvar os dados.');
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
    
    const handleChecklistTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            checklist: { ...prev.checklist, [name]: value }
        }));
    };

    const handleEquipmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newType = e.target.value as EquipmentType;
        setFormData(prev => ({
            ...initialFormData,
            unit: prev.unit,
            city: prev.city,
            equipmentType: newType,
        }));
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'internalPhoto' | 'externalPhoto') => {
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

    const handleGeneratePdf = async () => {
        if (!window.html2canvas || !window.jspdf) {
            alert("Erro: As bibliotecas de geração de PDF não foram carregadas. Verifique sua conexão com a internet e tente novamente.");
            return;
        }
        if (!formRef.current) {
            alert("Erro: O elemento do formulário não foi encontrado. Tente recarregar a página.");
            return;
        }
        
        setIsGenerating(true);
        try {
            const { jsPDF } = window.jspdf;
            const canvas = await window.html2canvas(formRef.current, { 
                scale: 2, 
                backgroundColor: '#111827',
                useCORS: true,
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save(`preventiva_${formData.unit || 'unidade'}_${formData.equipmentType}.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Ocorreu um erro ao gerar o PDF. Verifique o console para mais detalhes.");
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleSendWhatsapp = async () => {
        if (!window.html2canvas) {
            alert("Erro: A biblioteca de captura de imagem não foi carregada. Verifique sua conexão com a internet e tente novamente.");
            return;
        }
        if (!formRef.current) {
            alert("Erro: O elemento do formulário não foi encontrado. Tente recarregar a página.");
            return;
        }
        if (!navigator.share) {
            alert('Seu navegador não suporta a função de compartilhamento. Por favor, tente em um navegador móvel ou use a opção de gerar PDF.');
            return;
        }

        setIsGenerating(true);
        try {
            const canvas = await window.html2canvas(formRef.current, { 
                scale: 2, 
                backgroundColor: '#111827',
                useCORS: true,
            });
            const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
            
            if (!blob) {
                throw new Error("Falha na conversão do canvas para Blob.");
            }

            const fileName = `preventiva_${formData.unit || 'unidade'}_${formData.equipmentType}.png`;
            const file = new File([blob], fileName, { type: 'image/png' });
            
            const shareData = {
                files: [file],
                title: `Preventiva: ${formData.unit || 'Unidade'}`,
                text: `Checklist de manutenção preventiva para ${formData.equipmentType} na unidade ${formData.unit}.`
            };
            
            if (navigator.canShare && !navigator.canShare({ files: [file] })) {
                alert('Seu navegador não suporta o compartilhamento de imagens. Tente usar a opção de PDF.');
                setIsGenerating(false);
                return;
            }
            
            await navigator.share(shareData);

        } catch (error: any) {
            if (error.name !== 'AbortError') { // User cancellation is not an error
                 console.error("Erro ao compartilhar via WhatsApp:", error);
                 alert("Ocorreu um erro ao tentar compartilhar a imagem. Verifique o console para mais detalhes.");
            }
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSendEmail = () => {
        const subject = `Checklist Preventiva: ${formData.unit} - ${formData.equipmentType}`;
        let body = `Relatório de Manutenção Preventiva\n\n`;
        body += `Unidade: ${formData.unit}\n`;
        if (formData.city) body += `Cidade: ${formData.city}\n`;
        body += `Tipo de Equipamento: ${formData.equipmentType}\n`;
        if(formData.equipmentType === EquipmentType.OUTROS) body += `Equipamento: ${formData.otherEquipmentName}\n`;
        
        body += `\n--- Checklist ---\n`;
        Object.entries(formData.checklist).forEach(([key, value]) => {
            if(typeof value === 'boolean') {
                 body += `${key}: ${value ? 'Sim' : 'Não'}\n`;
            } else {
                 body += `${key}: ${value}\n`;
            }
        });

        body += `\nPrecisa de Reparo/Reposição: ${formData.repairNeeded ? 'Sim' : 'Não'}\n`;
        if (formData.repairNeeded) {
            body += `Descrição da Necessidade: ${formData.repairDescription}\n`;
        }

        body += `\nFoto Interna: ${formData.internalPhotoName || 'Não anexada'}\n`;
        body += `Foto Externa: ${formData.externalPhotoName || 'Não anexada'}\n`;

        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    const renderChecklist = () => {
        const { checklist } = formData;

        switch (formData.equipmentType) {
            case EquipmentType.CANCELA:
                const cancelaData = checklist as Partial<CancelaChecklist>;
                return (
                    <>
                        <CheckboxItem name="limpezaPlaca" label="Limpeza da placa" checked={!!cancelaData.limpezaPlaca} onChange={handleCheckboxChange} />
                        <CheckboxItem name="lubrificacaoMecanismos" label="Lubrificação dos mecanismos" checked={!!cancelaData.lubrificacaoMecanismos} onChange={handleCheckboxChange} />
                        <CheckboxItem name="organizacaoCabos" label="Organização dos cabos" checked={!!cancelaData.organizacaoCabos} onChange={handleCheckboxChange} />
                        <CheckboxItem name="fixacaoPasteis" label="Fixação dos Pastéis" checked={!!cancelaData.fixacaoPasteis} onChange={handleCheckboxChange} />
                    </>
                );
            case EquipmentType.TERMINAL:
                const terminalData = checklist as Partial<TerminalChecklist>;
                 return (
                    <>
                        <input type="text" name="terminalName" placeholder="Nome do Terminal" value={terminalData.terminalName || ''} onChange={handleChecklistTextChange} className="w-full p-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-green-500 focus:border-green-500" />
                        <CheckboxItem name="limpezaPlacas" label="Limpeza de placas" checked={!!terminalData.limpezaPlacas} onChange={handleCheckboxChange} />
                        <CheckboxItem name="limpezaImpressora" label="Limpeza da impressora" checked={!!terminalData.limpezaImpressora} onChange={handleCheckboxChange} />
                        <CheckboxItem name="organizacaoCabos" label="Organização de cabos" checked={!!terminalData.organizacaoCabos} onChange={handleCheckboxChange} />
                        <CheckboxItem name="testeVoltagem" label="Teste voltagem (fonte)" checked={!!terminalData.testeVoltagem} onChange={handleCheckboxChange} />
                        <CheckboxItem name="limpezaLeitor" label="Limpeza do leitor" checked={!!terminalData.limpezaLeitor} onChange={handleCheckboxChange} />
                    </>
                );
            case EquipmentType.EPA:
                const epaData = checklist as Partial<EpaChecklist>;
                 return (
                    <>
                        <input type="text" name="epaName" placeholder="Nome do EPA" value={epaData.epaName || ''} onChange={handleChecklistTextChange} className="w-full p-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-green-500 focus:border-green-500" />
                        <CheckboxItem name="limpezaMiniPC" label="Limpeza do Mini PC" checked={!!epaData.limpezaMiniPC} onChange={handleCheckboxChange} />
                        <CheckboxItem name="limpezaImpressora" label="Limpeza da impressora" checked={!!epaData.limpezaImpressora} onChange={handleCheckboxChange} />
                        <CheckboxItem name="organizacaoCabos" label="Organização de cabos" checked={!!epaData.organizacaoCabos} onChange={handleCheckboxChange} />
                        <CheckboxItem name="testeVoltagem" label="Teste voltagem (fonte)" checked={!!epaData.testeVoltagem} onChange={handleCheckboxChange} />
                        <CheckboxItem name="limpezaLeitor" label="Limpeza do leitor" checked={!!epaData.limpezaLeitor} onChange={handleCheckboxChange} />
                        <CheckboxItem name="calibragemMonitor" label="Calibragem monitor" checked={!!epaData.calibragemMonitor} onChange={handleCheckboxChange} />
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
                        {/* Section 1: Location */}
                        <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
                            <h2 className="text-xl font-semibold mb-4 border-b pb-2 border-gray-200 dark:border-gray-800">Localização</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <input type="text" name="unit" placeholder="Unidade (Ex: Nome da Garagem)" value={formData.unit} onChange={handleInputChange} className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-green-500 focus:border-green-500" />
                                <input type="text" name="city" placeholder="Cidade (Opcional)" value={formData.city} onChange={handleInputChange} className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-green-500 focus:border-green-500" />
                            </div>
                        </div>

                        {/* Section 2: Equipment */}
                        <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
                             <h2 className="text-xl font-semibold mb-4 border-b pb-2 border-gray-200 dark:border-gray-800">Equipamento</h2>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <select name="equipmentType" value={formData.equipmentType} onChange={handleEquipmentChange} className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-green-500 focus:border-green-500">
                                    <option value={EquipmentType.NONE} disabled>Selecione o tipo...</option>
                                    <option value={EquipmentType.CANCELA}>Cancela</option>
                                    <option value={EquipmentType.TERMINAL}>Terminal</option>
                                    <option value={EquipmentType.CAIXA}>Caixa</option>
                                    <option value={EquipmentType.PDV}>PDV</option>
                                    <option value={EquipmentType.EPA}>EPA</option>
                                    <option value={EquipmentType.OUTROS}>Outros</option>
                                </select>
                                {formData.equipmentType === EquipmentType.OUTROS && (
                                    <input type="text" name="otherEquipmentName" placeholder="Informe o equipamento" value={formData.otherEquipmentName} onChange={handleInputChange} className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-green-500 focus:border-green-500" />
                                )}
                            </div>
                        </div>

                        {/* Section 3: Checklist */}
                        {formData.equipmentType !== EquipmentType.NONE && (
                           <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
                                <h2 className="text-xl font-semibold mb-4 border-b pb-2 border-gray-200 dark:border-gray-800">Itens de Verificação</h2>
                                <div className="space-y-4">
                                    {renderChecklist()}
                                </div>
                            </div>
                        )}
                        
                        {/* Section 4: Repair and Photos */}
                        {formData.equipmentType !== EquipmentType.NONE && (
                            <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg space-y-6">
                                 <h2 className="text-xl font-semibold mb-4 border-b pb-2 border-gray-200 dark:border-gray-800">Reparos e Anexos</h2>
                                <CheckboxItem name="repairNeeded" label="Precisa de reposição ou reparo?" checked={formData.repairNeeded} onChange={handleCheckboxChange} />
                                {formData.repairNeeded && (
                                    <textarea name="repairDescription" placeholder="Descreva as necessidades do equipamento..." value={formData.repairDescription} onChange={handleInputChange} rows={4} className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-green-500 focus:border-green-500"></textarea>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FileInput label="Foto Interna" onChange={(e) => handleFileChange(e, 'internalPhoto')} fileName={formData.internalPhotoName} previewUrl={formData.internalPhoto}/>
                                    <FileInput label="Foto Externa" onChange={(e) => handleFileChange(e, 'externalPhoto')} fileName={formData.externalPhotoName} previewUrl={formData.externalPhoto}/>
                                </div>
                                <div className="mt-6 flex justify-center">
                                    <button onClick={handleSaveData} className="flex items-center gap-2 px-5 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900">
                                        <SaveIcon className="w-5 h-5"/> Salvar Dados
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Section 5: Actions */}
                <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-950/50 rounded-lg shadow-md">
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <button onClick={handleGeneratePdf} disabled={isGenerating} className="flex items-center gap-2 px-5 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900">
                           <FileTextIcon className="w-5 h-5"/> {isGenerating ? 'Gerando...' : 'Gerar PDF'}
                        </button>
                         <button onClick={handleSendWhatsapp} disabled={isGenerating} className="flex items-center gap-2 px-5 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900">
                           <WhatsappIcon className="w-5 h-5"/> {isGenerating ? 'Enviando...' : 'Enviar por WhatsApp'}
                        </button>
                        <button onClick={handleSendEmail} className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900">
                           <MailIcon className="w-5 h-5"/> Enviar por E-mail
                        </button>
                         <button onClick={handleRestore} className="flex items-center gap-2 px-5 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900">
                           <RotateCwIcon className="w-5 h-5"/> Restaurar Dados
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;