"""Text processing utilities powered by NLTK."""

from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords


def summarise_text(text: str, num_sentences: int = 5) -> dict:
    """Return a simple extractive summary and basic NLP stats for *text*.

    The summary picks the longest sentences (a rough heuristic) up to
    *num_sentences*.  This keeps the backend dependency-light while still
    being useful.
    """
    if not text:
        return {
            "summary": "",
            "word_count": 0,
            "sentence_count": 0,
            "keywords": [],
        }

    sentences = sent_tokenize(text)
    words = word_tokenize(text)

    # Keyword extraction: most frequent non-stopword tokens
    stop_words = set(stopwords.words("english"))
    filtered = [w.lower() for w in words if w.isalnum() and w.lower() not in stop_words]

    freq: dict[str, int] = {}
    for w in filtered:
        freq[w] = freq.get(w, 0) + 1

    keywords = sorted(freq, key=freq.get, reverse=True)[:10]

    # Simple extractive summary – pick the longest sentences
    ranked = sorted(sentences, key=len, reverse=True)
    summary_sentences = ranked[: min(num_sentences, len(ranked))]
    # Re-order them by their original position
    summary_sentences = sorted(summary_sentences, key=lambda s: sentences.index(s))

    return {
        "summary": " ".join(summary_sentences),
        "word_count": len(words),
        "sentence_count": len(sentences),
        "keywords": keywords,
    }
