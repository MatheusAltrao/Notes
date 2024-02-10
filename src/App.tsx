import { useState } from 'react';
import Logo from './assets/nlwlogo.svg';
import NewNoteCard from './components/NewNoteCard';
import NoteCard from './components/NoteCard';

export interface INote {
    id: string;
    date: Date;
    content: string;
}

const App = () => {
    const [notes, setNotes] = useState<INote[]>(() => {
        const notesOnStorage = localStorage.getItem('notes');

        if (notesOnStorage) {
            //convertendo de json para array
            return JSON.parse(notesOnStorage);
        }

        return [];
    });

    const [searchNotes, setSearchNotes] = useState('');

    function onNoteCreated(content: string) {
        const newNote: INote = {
            id: crypto.randomUUID(),
            date: new Date(),
            content,
        };
        const notesArray = [newNote, ...notes];
        setNotes(notesArray);
        //chama a api localstorate / passa o nome desse objeto / e como nao pode ser um array a gente converte o array um json
        localStorage.setItem('notes', JSON.stringify(notesArray));
    }

    function onDeleteNote(id: string) {
        const notesArray = notes.filter((note) => {
            return note.id !== id;
        });
        setNotes(notesArray);
        localStorage.setItem('notes', JSON.stringify(notesArray));
    }

    const filteredNotes =
        searchNotes !== ''
            ? notes.filter((note) =>
                  note.content
                      .toLowerCase()
                      .includes(searchNotes.toLowerCase()),
              )
            : notes;

    return (
        <div className='min-h-screen py-16 px-4 w-full max-w-[1100px] mx-auto space-y-6'>
            <div className='space-y-6'>
                <img src={Logo} alt='nlw ' />

                <form className='w-full'>
                    <input
                        value={searchNotes}
                        onChange={(e) => setSearchNotes(e.target.value)}
                        type='text'
                        placeholder='Busque em suas notas...'
                        className='focus:outline-none bg-transparent text-3xl w-full font-semibold placeholder:text-slate-500 tracking-tight '
                    />
                </form>

                <div className='w-full h-px bg-slate-700' />
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-3  auto-rows-[250px] gap-4'>
                <NewNoteCard onNoteCreated={onNoteCreated} />

                {filteredNotes.map((note, index) => (
                    <NoteCard
                        onDeleteNote={onDeleteNote}
                        key={index}
                        note={note}
                    />
                ))}
            </div>
        </div>
    );
};

export default App;
