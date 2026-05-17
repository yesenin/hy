import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import type { Word } from "./models";

const wordsApiUrl =
  "https://r681j7dz04.execute-api.eu-north-1.amazonaws.com/words";

function getDetailId(id: string | null): string {
  if (!id) {
    return "";
  }

  return id.split("-")[0] ?? id;
}

function getDetailLang(language: string | null): string {
  if (!language) {
    return "";
  }

  return language.split("-")[0] ?? language;
}

function ReadonlyField({ label, value }: { label: string; value: string }) {
  return (
    <label className="form-field form-field-readonly">
      <span>{label}</span>
      <input type="text" value={value} readOnly />
    </label>
  );
}

function WordDetails() {
  const [searchParams] = useSearchParams();
  const [word, setWord] = useState<Word | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const wordId = getDetailId(searchParams.get("id"));
  const lang = getDetailLang(searchParams.get("lang"));

  useEffect(() => {
    const abortController = new AbortController();

    async function loadWord() {
      if (!wordId || !lang) {
        setErrorMessage("Недостаточно данных для загрузки слова.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage(null);

        const response = await fetch(
          `${wordsApiUrl}/${wordId}?lang=${encodeURIComponent(lang)}`,
          { signal: abortController.signal },
        );

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = (await response.json()) as unknown;

        setWord(payload as Word);
      } catch (error) {
        if (
          abortController.signal.aborted ||
          (error instanceof DOMException && error.name === "AbortError")
        ) {
          return;
        }

        setErrorMessage("Не удалось загрузить карточку слова.");
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadWord();

    return () => {
      abortController.abort();
    };
  }, [lang, wordId]);

  return (
    <main className="admin-page">
      <section className="admin-panel">
        <p className="eyebrow">Protected Area</p>
        <h1>Word Details</h1>
        <p className="admin-copy">
          Readonly-страница слова из backend по `id` и `lang`.
        </p>

        {isLoading ? <p className="status-copy">Загрузка слова...</p> : null}
        {errorMessage ? <p className="status-copy">{errorMessage}</p> : null}

        {!isLoading && !errorMessage && word ? (
          <section
            className="admin-section"
            aria-labelledby="word-details-heading"
          >
            <div className="section-heading">
              <h2 id="word-details-heading">Карточка слова</h2>
              <p>Все поля пока доступны только для просмотра.</p>
            </div>

            <div className="word-form">
              <ReadonlyField label="ID" value={word.id} />
              <ReadonlyField label="Русское слово" value={word.ru} />
              <ReadonlyField label="Язык" value={word.language} />
              <ReadonlyField label="Часть речи / тип" value={word.kind} />
              <ReadonlyField label="Источник" value={word.source} />
              <ReadonlyField
                label="Черновик"
                value={
                  typeof word.draft === "boolean" ? String(word.draft) : "-"
                }
              />
              <ReadonlyField
                label="Начальная форма"
                value={
                  typeof word.initForm === "boolean"
                    ? String(word.initForm)
                    : "-"
                }
              />
              <ReadonlyField label="Создано" value={word.addedAt} />
              <ReadonlyField label="Изменено" value={word.modifiedAt} />

              <div className="readonly-group">
                <span>Переводы</span>
                {word.translations.length > 0 ? (
                  <div className="readonly-list">
                    {word.translations.map((translation) => (
                      <div className="readonly-card" key={translation.id}>
                        <ReadonlyField
                          label="Вариант"
                          value={translation.variant || "default"}
                        />
                        <ReadonlyField
                          label="Значение"
                          value={translation.value}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>Переводы отсутствуют.</p>
                  </div>
                )}
              </div>

              <div className="readonly-group">
                <span>Теги</span>
                {word.tags && word.tags.length > 0 ? (
                  <div className="readonly-list">
                    {word.tags.map((tag, idx) => (
                      <div className="readonly-card" key={idx}>
                        <ReadonlyField label="Ключ" value={tag} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>Теги отсутствуют.</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        ) : null}
      </section>
    </main>
  );
}

export default WordDetails;
