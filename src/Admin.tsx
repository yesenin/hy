import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import type { AddWordRequest } from "./models";

type AdminProps = {
  userName: string;
  userEmail: string;
  onLogout: () => void;
};

const wordsApiUrl =
  "https://r681j7dz04.execute-api.eu-north-1.amazonaws.com/words";

const languageOptions = [
  { value: "en", label: "английский" },
  { value: "fr", label: "французский" },
  { value: "sr", label: "сербский" },
  { value: "hy", label: "армянский" },
  { value: "other", label: "другой" },
] as const;

const kindOptions = [
  { value: "noun", label: "существительное" },
  { value: "verb", label: "глагол" },
  { value: "adjective", label: "прилагательное" },
  { value: "adverb", label: "наречие" },
  { value: "pronoun", label: "местоимение" },
  { value: "preposition", label: "предлог" },
  { value: "conjunction", label: "союз" },
  { value: "interjection", label: "междометие" },
  { value: "particle", label: "частица" },
  { value: "numeral", label: "числительное" },
  { value: "other", label: "прочее" },
  { value: "phrase", label: "фраза" },
] as const;

type AdminSection = "table" | "create";

type WordFormValues = {
  ru: string;
  language: AddWordRequest["language"];
  quickTranslation: AddWordRequest["quickTranslation"];
  tags: string;
  initForm: boolean;
  kind: AddWordRequest["kind"];
  draft: boolean;
  source: AddWordRequest["source"];
};

type AdminWordRow = {
  id: string;
  ru: string;
  language: string;
  draft?: boolean;
};

function isAdminWordRow(item: unknown): item is AdminWordRow {
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
    (draft === undefined || typeof draft === "boolean")
  );
}

function getDetailLang(language: string): string {
  return language.split("-")[0] ?? language;
}

async function fetchAdminWords(signal?: AbortSignal): Promise<AdminWordRow[]> {
  const response = await fetch(wordsApiUrl, { signal });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as unknown;

  if (
    !Array.isArray(payload) ||
    !payload.every((item) => isAdminWordRow(item))
  ) {
    throw new Error("Unexpected response shape");
  }

  return payload;
}

function Admin({ userName, userEmail, onLogout }: AdminProps) {
  const [activeSection, setActiveSection] = useState<AdminSection>("table");
  const [submittedWord, setSubmittedWord] = useState<AddWordRequest | null>(
    null,
  );
  const [words, setWords] = useState<AdminWordRow[]>([]);
  const [isWordsLoading, setIsWordsLoading] = useState(true);
  const [wordsError, setWordsError] = useState<string | null>(null);
  const [submissionMessage, setSubmissionMessage] = useState<string | null>(
    null,
  );
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<WordFormValues>({
    defaultValues: {
      ru: "",
      language: "en",
      quickTranslation: "",
      tags: "",
      initForm: false,
      kind: "noun",
      draft: true,
      source: "ui",
    },
  });

  useEffect(() => {
    const abortController = new AbortController();

    async function fetchWords() {
      try {
        setIsWordsLoading(true);
        setWordsError(null);
        setWords(await fetchAdminWords(abortController.signal));
      } catch (error) {
        if (
          abortController.signal.aborted ||
          (error instanceof DOMException && error.name === "AbortError")
        ) {
          return;
        }

        setWordsError("Не удалось загрузить таблицу слов.");
      } finally {
        if (!abortController.signal.aborted) {
          setIsWordsLoading(false);
        }
      }
    }

    void fetchWords();

    return () => {
      abortController.abort();
    };
  }, []);

  const onSubmit = handleSubmit(async (values) => {
    const nextWord: AddWordRequest = {
      ru: values.ru.trim(),
      language: values.language,
      quickTranslation: values.quickTranslation.trim(),
      tags: values.tags
        .split(/\n|,|;/)
        .map((value) => value.trim())
        .filter(Boolean),
      initForm: values.initForm,
      kind: values.kind,
      draft: values.draft,
      source: "ui",
    };

    try {
      setSubmissionMessage(null);
      setSubmissionError(null);

      const response = await fetch(wordsApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nextWord),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      setWords(await fetchAdminWords());
      setSubmittedWord(nextWord);
      setSubmissionMessage("Слово отправлено в backend.");
      reset({
        ru: "",
        language: values.language,
        quickTranslation: "",
        tags: "",
        initForm: false,
        kind: values.kind,
        draft: true,
        source: "ui",
      });
    } catch {
      setSubmissionError("Не удалось сохранить слово в backend.");
    }
  });

  return (
    <main className="admin-page">
      <section className="admin-panel">
        <h1>CMS</h1>
        <h4>Как она есть. А ты -- {userName}</h4>

        <nav className="admin-navbar" aria-label="Admin sections">
          <button
            type="button"
            className={
              activeSection === "table" ? "admin-tab is-active" : "admin-tab"
            }
            onClick={() => setActiveSection("table")}
          >
            Таблица слов
          </button>
          <button
            type="button"
            className={
              activeSection === "create" ? "admin-tab is-active" : "admin-tab"
            }
            onClick={() => setActiveSection("create")}
          >
            Добавить слово
          </button>
        </nav>

        {activeSection === "table" ? (
          <section
            className="admin-section"
            aria-labelledby="words-table-heading"
          >
            <div className="section-heading">
              <h2 id="words-table-heading">Таблица слов</h2>
              <p>
                Список загружается из backend и ведет на отдельную страницу
                слова.
              </p>
            </div>

            {isWordsLoading ? (
              <p className="status-copy">Загрузка слов...</p>
            ) : null}
            {wordsError ? <p className="status-copy">{wordsError}</p> : null}

            {!isWordsLoading && !wordsError ? (
              words.length > 0 ? (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ru</th>
                        <th>language</th>
                        <th>draft</th>
                      </tr>
                    </thead>
                    <tbody>
                      {words
                        .sort((a, b) => a.ru.localeCompare(b.ru))
                        .map((word) => (
                          <tr key={word.id}>
                            <td>
                              <Link
                                className="admin-table-link"
                                to={`/admin/words/${word.id}?lang=${encodeURIComponent(getDetailLang(word.language))}`}
                              >
                                {word.ru}
                              </Link>
                            </td>
                            <td>{word.language}</td>
                            <td>
                              {typeof word.draft === "boolean"
                                ? word.draft
                                  ? "true"
                                  : "false"
                                : "-"}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  <strong>Пока пусто</strong>
                  <p>Backend вернул пустой список слов.</p>
                </div>
              )
            ) : null}
          </section>
        ) : (
          <section className="admin-section" aria-labelledby="add-word-heading">
            <div className="section-heading">
              <h2 id="add-word-heading">Добавить слово</h2>
              <p>Форма собирает объект Word и фиксирует источник как ui.</p>
            </div>

            {submissionMessage ? (
              <p className="status-copy">{submissionMessage}</p>
            ) : null}
            {submissionError ? (
              <p className="status-copy">{submissionError}</p>
            ) : null}

            <form className="word-form" onSubmit={onSubmit}>
              <label className="form-field">
                <span>Русское слово</span>
                <input
                  type="text"
                  placeholder="например, дом"
                  {...register("ru", {
                    required: "Введите русское слово",
                    validate: (value) =>
                      value.trim().length > 0 || "Введите русское слово",
                  })}
                />
                {errors.ru ? <small>{errors.ru.message}</small> : null}
              </label>

              <label className="form-field">
                <span>Язык</span>
                <select {...register("language", { required: true })}>
                  {languageOptions.map((language) => (
                    <option key={language.value} value={language.value}>
                      {language.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="form-field">
                <span>Быстрый перевод</span>
                <input
                  type="text"
                  placeholder="house"
                  {...register("quickTranslation", {
                    required: "Введите перевод",
                    validate: (value) =>
                      value.trim().length > 0 || "Введите перевод",
                  })}
                />
                {errors.quickTranslation ? (
                  <small>{errors.quickTranslation.message}</small>
                ) : null}
              </label>

              <label className="form-field">
                <span>Часть речи / тип</span>
                <select {...register("kind", { required: true })}>
                  {kindOptions.map((kind) => (
                    <option key={kind.value} value={kind.value}>
                      {kind.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="form-field">
                <span>Теги</span>
                <input
                  type="text"
                  placeholder="быт, базовый"
                  {...register("tags")}
                />
              </label>

              <label className="form-field form-field-readonly">
                <span>Источник</span>
                <input type="text" readOnly {...register("source")} />
              </label>

              <div className="checkbox-row">
                <label className="checkbox-field">
                  <input type="checkbox" {...register("initForm")} />
                  <span>Начальная форма</span>
                </label>

                <label className="checkbox-field">
                  <input type="checkbox" {...register("draft")} />
                  <span>Черновик</span>
                </label>
              </div>

              <div className="form-actions">
                <button type="submit" disabled={isSubmitting}>
                  Сохранить слово
                </button>
              </div>
            </form>

            {submittedWord ? (
              <div className="preview-card" aria-live="polite">
                <span>Последний объект Word</span>
                <pre>{JSON.stringify(submittedWord, null, 2)}</pre>
              </div>
            ) : null}
          </section>
        )}

        <div className="admin-actions">
          <a className="ghost-button" href="#/">
            На заглавную
          </a>
          <button type="button" onClick={onLogout}>
            Выйти
          </button>
        </div>
      </section>
    </main>
  );
}

export default Admin;
