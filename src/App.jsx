import { useState } from 'react'
import TaskForm from './components/TaskForm';
import Banner from "./components/Banner";
import Menu from "./components/Menu";
import './App.css'


function App() {
    const [aktywnyWidok, setAktywnyWidok] = useState(null);

    return (
        <div>
            <h1>Task manager</h1>
            <Menu onZmienWidok={setAktywnyWidok} />

            {aktywnyWidok === "wszystkie" && (
                <div className="widok-placeholder">
                    <h2>📋 Wszystkie zadania</h2>
                    <p>Tu będą wszystkie zadania</p>
                </div>
            )}

            {aktywnyWidok === "dodaj" && (
                <div className="widok-placeholder">
                    <h2>➕ Dodaj zadanie</h2>
                    <p>Tu będzie formularz dodawania zadań</p>
                </div>
            )}

            {aktywnyWidok === "statystyki" && (
                <div className="widok-placeholder">
                    <h2>📊 Statystyki</h2>
                    <p>Tu będą statystyki zadań</p>
                </div>
            )}

            <Banner />
            <p>aplikacja React</p>

            <TaskForm />
        </div>
    );
}

export default App
