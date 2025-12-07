import WordMatch from "../components/WordsMatch";


function Cards() {
    return (
        <main className="flex flex-col items-center p-4">
            <h2>Cards Page</h2>
            <div>
                <WordMatch />
            </div>
        </main>
    );
}

export default Cards;