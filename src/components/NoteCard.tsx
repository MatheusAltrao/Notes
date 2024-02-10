import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { INote } from '../App';

interface INoteCard {
    note: INote;

    onDeleteNote: (id: string) => void;
}

const NoteCard = ({ note, onDeleteNote }: INoteCard) => {
    return (
        <Dialog.Root>
            <Dialog.Overlay className='dialog-overlay ' />
            <Dialog.Trigger className='note'>
                <div className='h-full'>
                    <span className='text-sm font-medium'>
                        {formatDistanceToNow(note.date, {
                            locale: ptBR,
                            addSuffix: true,
                        })}
                    </span>
                    <div className='break-words'>
                        <p className='text-sm leading-6 text-slate-400  text-left break-words'>
                            {note.content.slice(0, 300)} ...
                        </p>
                    </div>
                </div>
            </Dialog.Trigger>
            <Dialog.Content className=' dialog-content'>
                <div className='bg-slate-800 rounded-lg flex flex-col relative h-full  flex-1 overflow-hidden '>
                    <Dialog.Close className='dialog-close'>
                        <X size={18} />
                    </Dialog.Close>

                    <div className='h-full p-4 max-h-[600px] overflow-hidden overflow-y-auto'>
                        <span className='text-sm font-medium'>
                            {formatDistanceToNow(note.date, {
                                locale: ptBR,
                                addSuffix: true,
                            })}
                        </span>
                        <div className='break-words'>
                            <p className='text-sm leading-6 text-slate-400 whitespace-normal text-left break-words'>
                                {note.content}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => onDeleteNote(note.id)}
                        type='button'
                        className=' w-full bg-slate-900 group py-4 text-center font-semibold text-sm'
                    >
                        Deseja{' '}
                        <span className='text-red-500 group-hover:underline underline-offset-4'>
                            apagar essa nota
                        </span>
                        ?
                    </button>
                </div>
            </Dialog.Content>
        </Dialog.Root>
    );
};

export default NoteCard;
