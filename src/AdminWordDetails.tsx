import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import type { Tag, Translation, Word } from "./models";

const wordsApiUrl =
  "https://r681j7dz04.execute-api.eu-north-1.amazonaws.com/words";

function isTranslation(item: unknown): item is Translation {
  return (
    typeof item === "object" &&
    item !== null &&
    "id" in item &&
    typeof item.id === "string" &&
    "variant" in item &&
    typeof item.variant === "string" &&
    "value" in item &&
    typeof item.value === "string"
  );
}

function isTag(item: unknown): item is Tag {
  return (
    typeof item === "object" &&
    item !== null &&
    "id" in item &&
    typeof item.id === "string" &&
    "key" in item &&
    typeof item.key === "string" &&
    "value" in item &&
    typeof item.value === "string"
  );
}

function isWord(item: unknown): item is Word {
  const tags =
    typeof item === "object" && item !== null && "tags" in item
      ? item.tags
      : undefined;
  const initForm =
    typeof item === "object" && item !== null && "initForm" in item
      ? item.initForm
      : undefined;
  const draft =
    typeof item === "object" && item !== null && "draft" in item
      ? item.draft
      : undefined;

  return (
    typeof item === "object" &&
    item !== null &&
    "id" in item &&
    typeof item.id === "string" &&
    "ru" in item &&
    typeof item.ru === "string" &&
    "language" in item &&
    typeof item.language === "string" &&
    "translations" in item &&
    Array.isArray(item.translations) &&
    item.translations.every((translation) => isTranslation(translation)) &&
    "kind" in item &&
    typeof item.kind === "string" &&
    "source" in item &&
    typeof item.source === "string" &&
    "addedAt" in item &&
    typeof item.addedAt === "string" &&
    "modifiedAt" in item &&
    typeof item.modifiedAt === "string" &&
    (tags === undefined ||
      (Array.isArray(tags) && tags.every((tag) => isTag(tag)))) &&
    (initForm === undefined || typeof initForm === "boolean") &&
    (draft === undefined || typeof draft === "boolean")
  );
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

function AdminWordDetails() {
  const { wordId } = useParams();
  const [searchParams] = useSearchParams();
  const [word, setWord] = useState<Word | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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

        if (!isWord(payload)) {
          throw new Error("Unexpected response shape");
        }

        setWord(payload);
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

        <div className="admin-actions">
          <Link className="ghost-button" to="/admin">
            Back to admin
          </Link>
        </div>

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
                    {word.tags.map((tag) => (
                      <div className="readonly-card" key={tag.id}>
                        <ReadonlyField label="Ключ" value={tag.key} />
                        <ReadonlyField label="Значение" value={tag.value} />
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

export default AdminWordDetails;
