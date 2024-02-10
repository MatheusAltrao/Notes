import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface INewNoteCard {
    onNoteCreated: (cotent: string) => void;
}

let speechRecognition: SpeechRecognition | null = null;

const NewNoteCard = ({ onNoteCreated }: INewNoteCard) => {
    const [selectSection, setSelectSection] = useState<
        'conversation' | 'digitation'
    >('digitation');
    const [content, setContent] = useState('');
    const [isRecording, setIsRecording] = useState(true);

    const handleSaveNote = (e: FormEvent) => {
        e.preventDefault();

        if (content == '') {
            return;
        }

        onNoteCreated(content);
        toast.success('Nota criada com sucesso');
        setContent('');
    };

    const handleStartRecording = () => {
        setSelectSection('conversation');

        const isSpeechRecognitionAPI =
            'SpeechRecognition' in window ||
            'webkitSpeechRecognition' in window;

        if (!isSpeechRecognitionAPI) {
            alert('Nao suporta a gravacao, troque de navegador');
            return;
        }

        setIsRecording(true);

        const SpeechRecognitionAPI =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        speechRecognition = new SpeechRecognitionAPI();
        speechRecognition.lang = 'pt-BR';
        speechRecognition.continuous = true;
        speechRecognition.maxAlternatives = 1;
        speechRecognition.interimResults = true;

        speechRecognition.onresult = (e: SpeechRecognitionEvent) => {
            const transcription = Array.from(e.results).reduce(
                (text, result) => {
                    return text.concat(result[0].transcript);
                },
                '',
            );

            setContent(transcription);
        };

        speechRecognition.onerror = (e: SpeechRecognitionErrorEvent) => {
            console.error(e);
        };

        speechRecognition.start();
    };

    const selectSectionDigitation = () => {
        setContent('');
        handleStopRecording();
        setSelectSection('digitation');
    };

    function handleStopRecording() {
        setIsRecording(false);
        if (speechRecognition !== null) {
            speechRecognition.stop();
        }
    }

    const textareaContent = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textareaContent.current) {
            textareaContent.current.focus();
            textareaContent.current.setSelectionRange(
                content.length,
                content.length,
            );
        }
    }, [content]);

    return (
        <Dialog.Root>
            <Dialog.Overlay className='dialog-overlay ' />
            <Dialog.Trigger className='note'>
                <div className='h-full'>
                    <span className='text-sm font-medium '>Adicionar nota</span>
                    <p className='text-sm leading-6 text-slate-400 '>
                        Grave uma nota em áudio que será convertida para texto
                        automaticamente.
                    </p>
                </div>
            </Dialog.Trigger>
            <Dialog.Content className=' dialog-content    '>
                <div className='bg-slate-800 rounded-lg relative h-full flex flex-1 overflow-hidden '>
                    <Dialog.Close className=' dialog-close '>
                        <X size={18} />
                    </Dialog.Close>
                    <form className='flex flex-1 flex-col'>
                        <div className='flex flex-1 flex-col gap-4 p-5 '>
                            <div>
                                <h2 className='text-sm font-medium '>
                                    Adicionar nota
                                </h2>

                                <p className='text-sm leading-6 text-slate-400 '>
                                    Comece{' '}
                                    <button
                                        type='button'
                                        onClick={handleStartRecording}
                                        className='text-lime-400 hover:underline underline-offset-4'
                                    >
                                        gravando uma nota
                                    </button>{' '}
                                    em áudio ou se preferir{' '}
                                    <button
                                        type='button'
                                        onClick={() =>
                                            setSelectSection('digitation')
                                        }
                                        className='text-lime-400 hover:underline underline-offset-4'
                                    >
                                        utilize apenas texto
                                    </button>
                                    .
                                </p>
                            </div>

                            <header className='flex items-center gap-4'>
                                <button
                                    onClick={handleStartRecording}
                                    type='button'
                                    className={`px-8 py-2 rounded-md transition-colors font-semibold  text-center text-sm ${
                                        selectSection == 'conversation'
                                            ? 'bg-lime-400 hover:bg-lime-500 text-lime-950  '
                                            : 'bg-slate-400 hover:bg-slate-500 text-slate-950'
                                    }`}
                                >
                                    Voz
                                </button>
                                <button
                                    onClick={selectSectionDigitation}
                                    type='button'
                                    className={`px-8 py-2 rounded-md transition-colors font-semibold  text-center text-sm ${
                                        selectSection == 'digitation'
                                            ? 'bg-lime-400 hover:bg-lime-500 text-lime-950  '
                                            : 'bg-slate-400 hover:bg-slate-500 text-slate-950'
                                    }`}
                                >
                                    Digitado
                                </button>
                            </header>

                            {selectSection == 'conversation' && (
                                <div className='flex flex-1 flex-col'>
                                    <textarea
                                        readOnly
                                        ref={textareaContent}
                                        value={content}
                                        onChange={(e) =>
                                            setContent(e.target.value)
                                        }
                                        placeholder='Insira a sua nota '
                                        autoFocus
                                        className='outline-none bg-transparent w-full resize-none leading-6 text-slate-400 flex-1 '
                                    />

                                    <div className='space-y-2'>
                                        {isRecording ? (
                                            <button
                                                onClick={handleStopRecording}
                                                type='button'
                                                className=' w-full bg-slate-900 hover:bg-slate-700 transition-colors  py-4  text-center rounded-md font-semibold text-sm'
                                            >
                                                <div className='flex items-center justify-center gap-2'>
                                                    {' '}
                                                    <div className='w-2 h-2 animate-pulse  rounded-full bg-red-600' />{' '}
                                                    <p>
                                                        Gravando! (clique p/
                                                        interromper)
                                                    </p>
                                                </div>
                                            </button>
                                        ) : (
                                            <button
                                                onClick={handleStartRecording}
                                                type='button'
                                                className=' w-full bg-red-900 hover:bg-red-700 transition-colors  py-4  text-center rounded-md font-semibold text-sm'
                                            >
                                                <div className='flex items-center justify-center gap-2'>
                                                    <p>
                                                        Pausado! (clique p/
                                                        gravar)
                                                    </p>
                                                </div>
                                            </button>
                                        )}

                                        <button
                                            type='button'
                                            onClick={handleSaveNote}
                                            className=' w-full bg-lime-400 hover:bg-lime-500 transition-colors text-lime-950 rounded-md font-semibold py-4 text-center text-sm'
                                        >
                                            Salvar nota
                                        </button>
                                    </div>
                                </div>
                            )}

                            {selectSection == 'digitation' && (
                                <div className='flex flex-1 flex-col'>
                                    <textarea
                                        ref={textareaContent}
                                        value={content}
                                        onChange={(e) =>
                                            setContent(e.target.value)
                                        }
                                        placeholder='Insira a sua nota '
                                        autoFocus
                                        className='outline-none bg-transparent w-full resize-none leading-6 text-slate-400 flex-1 '
                                    />

                                    <div className='space-y-2'>
                                        <button
                                            type='button'
                                            onClick={handleSaveNote}
                                            className=' w-full bg-lime-400 hover:bg-lime-500 transition-colors text-lime-950 rounded-md font-semibold py-4 text-center text-sm'
                                        >
                                            Salvar nota
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </Dialog.Content>
        </Dialog.Root>
    );
};

export default NewNoteCard;
