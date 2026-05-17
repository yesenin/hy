import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { type AuthUser } from "./auth";

type HomeProps = {
  user: AuthUser | null;
};

type WordDto = {
  id: string;
  ru: string;
};

function isWordDto(item: unknown): item is WordDto {
  return (
    typeof item === "object" &&
    item !== null &&
    "id" in item &&
    typeof item.id === "string" &&
    "ru" in item &&
    typeof item.ru === "string"
  );
}

function Home({ user }: HomeProps) {
  /*
  const [words, setWords] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  */

  useEffect(() => {
    const abortController = new AbortController();

    /*
    async function fetchWords() {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const response = await fetch(
          "https://r681j7dz04.execute-api.eu-north-1.amazonaws.com/words",
          { signal: abortController.signal },
        );

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = (await response.json()) as unknown;

        if (
          !Array.isArray(payload) ||
          !payload.every((item) => isWordDto(item))
        ) {
          throw new Error("Unexpected response shape");
        }

        setWords(payload.map((item) => item.ru));
      } catch {
        if (abortController.signal.aborted) {
          return;
        }

        setErrorMessage("Could not load the word list.");
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void fetchWords();
    */

    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <main className="landing-page">
      <section className="words-card">
        <h1>Слова</h1>
        <h4>А кто их знает, как их все дешево взять из Dynamo DB.</h4>

        {/* {isLoading ? <p className="status-copy">Loading...</p> : null}
        {errorMessage ? <p className="status-copy">{errorMessage}</p> : null}

        {!isLoading && !errorMessage ? (
          <ul className="words-list">
            {words.map((word) => (
              <li key={word}>{word}</li>
            ))}
          </ul>
        ) : null} */}

        <footer className="page-footer">
          {user ? (
            <span className="footer-note">Signed in as {user.email}</span>
          ) : null}
          <Link className="footer-admin-link" to="/admin">
            CMS
          </Link>
        </footer>
      </section>
    </main>
  );
}

export default Home;
