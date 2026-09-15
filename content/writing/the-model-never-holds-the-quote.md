# The model never holds the quote

*How Bibelrösten makes a language model unable to misquote scripture, rather than merely asking it not to.*

---

Bibelrösten is a Swedish voice you call and talk with for five minutes. No
account, no chat log, one screen. You talk about your life, and sometimes the
conversation turns to the Bible.

The hard part was never the conversation. It is the sentence that starts with
"the Bible says".

A language model will finish that sentence beautifully. It will produce
something with the right cadence, the right archaic Swedish, the right weight.
And often it will be wrong, in a way that is invisible to the person listening
and invisible to me. That failure mode is not acceptable here. Somebody calls
at two in the morning, hears a verse that sounds like comfort, and it does not
exist.

So the rule is:

> The model writes a reference. The server looks it up and inserts the verified
> text. The model never holds the quote.

Everything below is what it took to make that a gate rather than a request.

## Asking nicely does not work

My first version put the rule in the system prompt. Do not quote scripture from
memory. Emit a reference in braces and the server will fill it in.

It leaked in roughly six replies out of twelve.

Not because the model was defiant. It leaked because the model kept describing
the machinery to the listener: "the reference", "the place", "the brace", "the
text is coming", "I can show you the passage so you can read it". I banned each
phrase as I found it. It invented new ones faster than I could write them down.

The root cause turned out not to be word choice. The model believed it was
showing me something. It had no concept that its output becomes air.

So the prompt now opens by telling it what it is: a voice. Nothing is shown,
nobody reads, everything is heard.

| | Replies that leaked |
|---|---|
| Original prompt | about 6 of 12 |
| After the reframe | 2 of 12 |
| After the reframe, plus a hard gate | 1 of 12, and it is struck |

The reframe did most of the work. The gate catches what is left. I would not
trust either one alone, and that is the point: a prompt is a request, and
requests are not guarantees.

## The pipeline, and why the order is not arbitrary

```
LLM ──▶ substitute braces ──▶ split sentences ──▶ review ──▶ TTS
        {Matt 6:34} becomes                      strikes
        verified text                            claims
```

The brace substitution has to happen **before** the sentence splitter. If it
runs after, a sentence can be cut through the middle of a brace and the
reference never becomes whole.

The review has to happen **after** the splitter, because it needs a complete
sentence before it can judge one. So it sits last, immediately before audio.

Neither of those is a preference. Swap them and the layer has a hole.

## Every failure drops. Nothing guesses.

| What went wrong | What happens |
|---|---|
| The reference will not parse | Dropped. The voice says nothing about the passage. |
| The book does not exist, or the chapter does not fit | Dropped. |
| The reference is valid but missing from the corpus | Dropped. |
| The brace is still open when the stream ends | Discarded. `{Matt 6` never becomes sound. |
| A sentence makes a claim about what scripture contains | Struck. The rest of the reply continues. |
| A sentence talks about the machinery | Struck. |

The default policy replaces a miss with **nothing**. The voice would rather say
nothing about the passage than something it invented.

Striking whole sentences carries an obvious risk: that a reply is gutted and
what remains is nonsense. Across the test set, zero replies became unreadable.
That is checked on every run rather than assumed, because it is exactly the
kind of thing that stays true until it quietly is not.

## The second guard, and where it has to sit

The review above catches everything the model says *about* scripture. Claim
phrases, machinery words, quotation marks.

It catches nothing if the model simply writes naked scripture with no brace
around it. There is no claim phrase to match and no machinery word to find. The
sentence just is, and it sounds true.

So there is a second guard, and it looks for two different things.

**Real scripture, quoted without a brace.** Seven consecutive words from the
corpus is enough. The model quoted correctly, but from memory rather than from
the lookup, which means the next one is just as confidently wrong and nobody
will be able to tell the difference.

**Fabricated text that sounds like the 1917 translation.** Verses the model
constructs are not in the corpus and cannot be looked up. What gives them away
is the costume: the archaic Swedish forms, and HERREN in capitals.

The placement is the part I find most interesting. This guard runs **before**
the brace substitution, not after.

After substitution, verified text and the model's own words are the same
stream. A guard hunting for scripture would fire on precisely the text it is
supposed to let through, and I would need to track the provenance of every span
to tell them apart. Before substitution, the brace is still just `{Ps 23:4}`.
Everything flowing past was written by the model. There is nothing to
disambiguate, so there is no provenance to track.

You can see both outcomes in one session. Same word, two fates:

```
YOU:   Read me something.
       · substituted {Ps 4:8}
VOICE: ...Du giver mig glädje i hjärtat...     "giver" passes, it is verified

YOU:   Finish the sentence: In the beginning God created
       · substituted {1 Mos 1:1}
VOICE: I begynnelsen skapade Gud himmel och jord.   passes, it came through a brace
```

Had the model written that same sentence without a brace, the guard would have
struck it.

## Seven words, because five was measured and failed

Seven is not a round number somebody picked.

At five words, the guard struck 2 of 33 ordinary pastoral replies. Both were
sequences of nothing but small common words, and a sequence like that turns up
somewhere in 31,052 verses eventually.

At seven: zero false positives across the same thirty-three, and every verbatim
quotation I tested is still caught.

## The corpus, and the footnotes nobody would have heard coming

31,052 verses, all 66 books, from a machine-readable edition of the 1917
Swedish translation, which is out of copyright. The file is 5.6 MB, is not
committed, and is rebuilt by a script that validates every reference against
the book list and reports coverage per book, so half an import is visible
immediately rather than discovered in production.

If the corpus file is missing, the loader refuses to construct. The server
would rather not start than run and quietly never find a verse.

The import caught two things I would not have predicted.

**The footnote apparatus was pasted inside the verses.** Matthew 6:34 ended
with a bracketed pointer into the glossary. Read aloud, a footnote would have
sounded exactly like scripture, which is the precise failure the whole layer
exists to prevent. 511 verses carried an apparatus; in 222 of them the note
began after the verse ended and was clipped.

The cleanup turns on a space. `människan[1] av stoft` is a marker inside a
sentence and the marker alone is removed. `för varandra. [1] Hebr adám` is a
note starting there, and everything after it goes.

**17 verses contained nothing but a footnote marker.** These are passages
absent from this edition. They would have been read aloud as "bracket one".
They are treated as missing now.

Zero brackets remain in the corpus.

The structure is checked against facts I can look up independently: Psalm 119
has 176 verses, Psalm 117 has 2, Genesis 1 has 31, Matthew 5 has 48. Loading
takes 77 ms at startup. A lookup costs 0.008 ms.

## What the layer costs

0.04 ms per reply.

The substitution buffers only while a brace is open, and the review is a
pattern match against a finished sentence. The layer costs nothing from the
latency budget it exists to protect, which matters because this is a voice: a
pause is not a spinner, it is a person waiting.

## What I did not verify, and cannot

I have verified that the corpus text is complete and correctly structured.

I have **not** verified that it is correct, and I cannot. Checking it against my
own memory of the Bible is the same mistake the entire layer exists to prevent.
I would be doing by hand precisely what I forbade the model to do.

So that stays an open item with a named owner and a method: compare against a
printed 1917 in at least ten places, spread across both testaments, with
particular attention to the 222 verses where a note was clipped, before anyone
listens.

## Still open

The review is a heuristic. It will both miss and overreach, and it should be
measured against real replies rather than assumed to work.

And there is a decision I have not made. A harder rule produces more refusals:
the model declines to reference anything rather than risk it. When that
happens, does the voice fall back to a curated map of topics, or does it say
nothing at all? Both answers are defensible. I have not picked one.

---

The general shape of this, for anyone building on a language model where being
confidently wrong is not survivable: decide what the model is not allowed to
hold. Then move that thing out of its reach, put the gate where provenance is
still unambiguous, and measure the threshold instead of choosing it. A prompt
tells the model what you would prefer. Only the pipeline decides what reaches
the person.
