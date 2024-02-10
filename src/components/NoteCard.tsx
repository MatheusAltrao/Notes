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
                <div>
                    <span className='text-sm font-medium '>
                        {formatDistanceToNow(note.date, {
                            locale: ptBR,
                            addSuffix: true,
                        })}
                    </span>
                    <p className='text-sm leading-6 text-slate-400 '>
                        {note.content}
                    </p>
                </div>
            </Dialog.Trigger>
            <Dialog.Content className=' dialog-content'>
                <Dialog.Close className='dialog-close'>
                    <X size={18} />
                </Dialog.Close>
                <div className='flex flex-1 flex-col gap-3 p-5 '>
                    <span className='text-sm font-medium '>
                        {formatDistanceToNow(note.date, {
                            locale: ptBR,
                            addSuffix: true,
                        })}
                    </span>
                    <p className='text-sm leading-6 text-slate-400 '>
                        {note.content}
                    </p>
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
            </Dialog.Content>
        </Dialog.Root>
    );
};

export default NoteCard;
