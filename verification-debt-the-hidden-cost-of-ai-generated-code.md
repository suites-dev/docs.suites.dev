---
title: "Verification debt: the hidden cost of AI-generated code"
author: "xfz | 115 points | 2026-03-07"
published: 2026-03-07
source: https://news.ycombinator.com/item?id=47289406
date: 2026-09-07T05:38:05.804Z
---

[https://fazy.medium.com/agentic-coding-ais-adolescence-b0d13452f981](https://fazy.medium.com/agentic-coding-ais-adolescence-b0d13452f981)

## Comments (23)

**Kerrick** · 2026-03-07

\> It gets 50% more pull requests, 50% more documentation, 50% more design proposals

Perhaps this will finally force the pendulum to swing back towards continuous integration (the practice now aliased trunk-based development to disambiguate it from the build server). If we're really lucky, it may even swing the pendulum back to favoring working software over comprehensive documentation, but maybe that's hoping too much. :-)

**maxdo** · 2026-03-07

Code is fully disposable way to generate custom logic.

Hand crafted , scalable code will be a very rare phenomenon

There will be a clear distinction between too.

**hnthrow0287345** · 2026-03-07

This still seems like technical debt to me. It's just debt with a much higher compounding interest rate and/or shorter due date. Credit cards vs. traditional loans or mortgages.

\>And six months later you discover you’ve built exactly what the spec said — and nothing the customer actually wanted.

That's not a developer problem, it's a PM/business problem. Your PM or equivalent should be neck deep in finding out what to build. Some developers like doing that (likely for free) but they can't spend as much time on it as a PM because they have other responsibilities, so they are not as likely not as good at it.

If you are building POCs (and everyone understands it's a POC), then AI is actually better getting those built as long as you clean it up afterwards. Having something to interact with is still way better than passively staring at designs or mockup slides.

Developers being able to spend less time on code that is helpful but likely to be thrown away is a good thing IMO.

**lowsong** · 2026-03-07

\> AI is actually better getting those built as long as you clean it up afterwards

I've never seen a quick PoC get cleaned up. Not once.

I'm sure it happens sometimes, but it's very rare in the industry. The reality is that a PoC usually becomes "good enough" and gets moved into production with only the most perfunctory of cleanup.

**somewhereoutth** · 2026-03-07

There is nothing as permanent as a temporary solution!

**tpoacher** · 2026-03-08

Yes. Or, "Prototypes have a bad habit of becoming the product".

**gregoryl** · 2026-03-07

The key to every quick POC having a short life, is a reliance on manual work outside of the engineering team.

**dwaltrip** · 2026-03-07

This is genius.

**tpoacher** · 2026-03-08

I want to know more. Can you give an example? :D

**suzzer99** · 2026-03-07

One trick for avoiding this is to use artifacts in the PoC that no self-respecting developer would ever allow in production. I use html tables in PoCs because front-end devs hate them - with old-school properties like cellpadding that I know will get replaced.

I also name everything DEMO\_\_ so at least they'll have to go through the exercise or renaming it. Although I've had cases where they don't even do that lol. But at least then you know who's totally worthless.

**gowld** · 2026-03-07

Bad code isn't Technical Debt, it's an unhedged Call Option

If you search for that quote, you can find #1 result is an AI slop paraphrase published last week, but the original article was 11 years ago, and republished 3 years ago.

[https://higherorderlogic.com/programming/2023/10/06/bad-code...](https://higherorderlogic.com/programming/2023/10/06/bad-code-isnt-technical-debt-its-an-unhedged-call-option.html)

**johngossman** · 2026-03-07

This verification problem is general.

As an experiment, I had Claude Cowork write a history book. I chose as subject a biography of Paolo Sarpi, a Venetian thinker most active in the early 17th century. I chose the subject because I know something about him, but am far from expert, because many of the sources in Italian, in which I am a beginner, and because many of the sources are behind paywalls, which does not mean the AIs haven't been trained on them.

I prompted it to cite and footnote all sources, avoid plagiarism and AI-style writing. After 5 hours, it was finished (amusingly, it generated JavaScript and emitted a DOCX). And then I read the book. There was still a lingering jauntiness and breathlessness ("Paolo Sarpi was a pivotal figure in European history!") but various online checkers did not detect AI writing or plagiarism. I spot checked the footnotes and dates. But clearly this was a huge job, especially since I couldn't see behind the paywalls (if I worked for a Uni I probably could).

Finally, I used Gemini Deep Research to confirm the historical facts and that all the cited sources exist. Gemini thought it was all good.

But how do I know Gemini didn't hallucinate the same things Claude did?

Definitely an incredible research tool. If I were actually writing such a book, this would be a big start. But verification would still be a huge effort.

**apical\_dendrite** · 2026-03-07

I used gemini to look up a relative with a connection to a famous event. The relative himself is obscure, but I have some of his writings and I've heard his story from other relatives. Gemini fabricated a completely false narrative about my relative that was much more exciting than what actually happened. I spent a bunch of time looking at the sources that Gemini supplied trying to verify things and although the sources were real, the story Gemini came up with was completely made up.

**johngossman** · 2026-03-07

Yup. I've had Gemini create fake citations to papers. I've also had it hallucinate the contents of paywalled papers, so I know I can't trust anything it writes, though I am getting better at using it recursively to verify things.

**hirvi74** · 2026-03-07

I am certain I read article that was posted on YN a month or so ago about some researchers that were caught using false citations in their research.

If I remember correctly, some group used an AI tool to sniff for AI citations in other's works. What I remember most was how abhorrent some of the sources that the AI sniffer caught. One of the citation's authors was literally cited as "FirstName LastName" -- didn't even sub in a fake name lol.

Edit: I found the OP:

[https://news.ycombinator.com/item?id=46720395](https://news.ycombinator.com/item?id=46720395)

**gowld** · 2026-03-07

Before AI, the smartest human still had to pass the paywall to access paywalled content.

AI has exacerbated the Internet's "content must be free or else does not exist" trend.

It's just not interesting to challenge an AI to write professional research content without giving it access to research conetent. Without access, it's just going to paraphrase what's already available.

**hirvi74** · 2026-03-07

I believe that, on a fundamental level, the principle of 'trust, but verify' can be followed to its logical endpoint, as covered in Ken Thompson's lecture, 'Reflections on Trusting Trust' \[1\]. At some point, one simply has to trust that something is correct, unless they have the capability to verify every step of a long chain of indirection.

So, in regard to your book: Claude may or may not have hallucinated the information from its cited sources. Gemini, as well. However, say you had access to the cited information behind a paywall. How would you go about verifying the information cited in those sources was correct?

Since the release of LLMs over the past four years or so, I have noticed a trend where people are (rightfully) hesitant to trust the output of LLMs. But if the knowledge is in a book or comes from another other man-made source, it's some how infallible? Such thinking reminds me of my primary schooling days. Teachers would not let us use Wikipedia as a source because, "Anyone can edit anything." Though, it's as one cannot write anything they want in a book -- be it true or false?

How many scientific researchers have p-hacked their research, falsified data, or used other methods of deceit? I do not believe it's a truly an issue on a grand scale nor does it make vast amounts of science illegitimate. When caught, the punishments are usually handled in a serious manner, but no telling how much falsified research was never caught.

I do believe any and all information provided by LLMs should be verified and not blindly trusted, however, I extend that same policy to works from my fellow humans. Of course, no one has the time to verify every single detail of every bit of information one comes across. Hence, at some point, we all must settle on trusting in trust. Knowledge that we cannot verify is not knowledge. It is faith.

\[1\] [https://www.cs.cmu.edu/~rdriley/487/papers/Thompson\_1984\_Ref...](https://www.cs.cmu.edu/~rdriley/487/papers/Thompson_1984_ReflectionsonTrustingTrust.pdf)

**regus** · 2026-03-07

This is great, your final line summarizes my thoughts as well. When it comes to matters of faith your average Redditor and Hacker News commenter will heap scorn and derision on religious people for accepting things blindly without any proof, yet they will blindly accept what other people tell them is true, or now what an LLM says is true.

**habinero** · 2026-03-08

\> But if the knowledge is in a book or comes from another other man-made source, it's some how infallible

Nobody who's ever done research believes that. *Everything* gets put along a spectrum of trust/accuracy.

You should be able to say what you believe, what you base that belief on, what it would take to disprove that belief, and how likely you think it is to be disproven.

That's why you do research from as many primary sources as you can, because yeah, otherwise you're reading someone else's interpretation. Sometimes you can't do that (you don't read the language, etc) and then you have to judge the quality of the interpretation.

It's an enormous amount of work to write a book, and making things up doesn't make that process a whole lot easier. So most people *try* to be accurate. Especially with editors and such doublechecking work. I still always judge the quality of the work as I'm reading it.

LLMs just flat out can't be trusted. They're endless fountains of words and aren't accurate by nature. They're fine if you already know the answer, and not fine if you don't.

**VanTodi** · 2026-03-07

I've come to the point where I think generated code is nothing better than a random package I install. Did I read it all and just accepted what was promised? Yes Can it bite me in the butt somewhere down the road? Probably, but I currently at least have more doubt about the generated code than a random package I picked up somewhere on git which readme I just partly skipped over.

**somewhereoutth** · 2026-03-07

However a random \[but well established\] package will have been used many many times, thus will have been verified in the wild, and likely will have a bug tracker, updates, and perhaps even a community of people who care about that particular code. No comparison really.

**apical\_dendrite** · 2026-03-07

My company recently hired a contractor. He submits multi-thousand line PRs every day, far faster than I can review them. This would maybe be OK if I could trust his output, but I can't. When I ask him really basic questions about the system, he either doesn't know or he gets it wrong. This week, I asked for some simple scripts that would let someone load data in a a local or staging environment, so that the system could be tested in various configurations. He submitted a PR with 3800 lines of shell scripts. We do not have any significant shell scripts anywhere else in our codebase. I spent several hours reviewing it with him - maybe more time than he spent writing it. His PR had tons and tons of end-to-end tests of the system that didn't actually test anything - some said they were validating state, but passed if a get request returned a 200. There were a few tests that called a create API. The tests would pass if the API returned an ID of the created object. But they would ALSO pass if the test didn't return an ID. I was trying to be a good teacher, so I kept asking questions like "why did you make this decision", etc, to try to have a conversation about the design choices and it was very clear that he was just making up bullshit rationalizations - he hadn't made any decisions at all. There was one particularly nonsensical test suite - it said it was testing X but included API calls that had nothing to do with X. I was trying to figure out how he had come up with that, and then I realized - I had given him a Postman export with some example API requests, and in one of the API requests I had gotten lazy and modified the request to test something but hadn't modified the name in Postman. So the LLM had assumed that the request was related to the old name and used it when generating a test suite, even though these things had nothing to do with each other. He had probably never actually read the output so he had no idea that it made no sense.

When he was first hired, I asked him to refactor a core part of the system to improve code quality (get rid of previous LLM slop). He submitted a 2000+ line PR within a day or so. He's getting frustrated because I haven't reviewed it and he has other 2000+ line PRs waiting on review. I asked him some questions about how this part of the system was invoked and how it returned data to the rest of the system, and he couldn't answer. At that point I tried to explain why I am reluctant to let him commit his refactor of a core part of the system when he can't even explain the basic functionality of that component.

**lpnam0201** · 2026-03-07

Do you think he used AI to generate that much code without ever understanding or having a look at the code ? Why was he hired ?

**apical\_dendrite** · 2026-03-07

Yes, because he can't answer basic questions about the code.

He was hired because we needed a contractor quickly and he and his company represented to us that he was a lot more experienced than he actually is.

**afro88** · 2026-03-07

Will you get rid of him? It sounds like he's wasting a lot of your time

**scuff3d** · 2026-03-07

This sums up the inherent friction between hype and reality really well.

CEOs and hype men want you to believe that LLMs can replace everyone. In 6 months you can give them the keys to the kingdom and they'll do a better job running your company then you did. No more devs. No more QA. No more pesky employees who needs crazy stuff like sleep, and food, and time off to be a human.

Then of course we run face first into reality. You give the tool to an idiot (or a generally well meaning person not paying enough attention) and you end up with 2k PRs that are batshit insane, production data based deleted, malicious code downloaded and executed on just machines, email archives deleted, and entire production infrastructure systems blown away. Then the hype men come back around and go "well yeah, it's not the tools fault, you still need an expert at the wheel, even though you were told you don't".

LLMs can do amazing things, and I think there's a lot of opportunities to improve software products if used correctly, but reality does not line up with the hype, and it never will

**gowld** · 2026-03-07

\> CEOs and hype men want you to believe that LLMs can replace everyone.

\> they'll do a better job running your company

SWEs are the ones running the company.

CEOs are.

**scuff3d** · 2026-03-07

I was being hyperbolic to make a point. Not literal.

**gowld** · 2026-03-07

Why are you paying someone who isn't doing the job you hired someone to do?

Why are you acting like you work for the contractor, instead of the contractor workign for you?

Why are you teaching a contractor anything? That's a violation of labor law. You are treating a contractor like an employee.

**apical\_dendrite** · 2026-03-07

Excellent questions.

**metajack** · 2026-03-07

I expect you'll be seen as the problem for slowing an obviously productive person down. What a time to be alive :(

**axi0m** · 2026-03-07

I'm observing pretty much the same pattern in my job. The sad truth is, people -especially non-technical- get too easily impressed by vibe-coded projects or contributions made in a few hours, because it's shiny and it gives the impression of a productivity boost. Don't you dare asking how that is supposed to scale, if it's secure or even extensible, or you'll be the one killing the mood in the room. Even though that's precisely the hard part of the job.

**bryanlarsen** · 2026-03-07

Verification is the bottleneck now, so we have to adjust our tooling and processes to make verification as easy as possible.

When you submit a PR, verifiability should be top of mind. Use those magic AI tools to make the PR as easy to possible to verify as possible. Chunk your PR into palatable chunks. Document and comment to aid verification. Add tests that are easy for the reviewer to read, test and tweak. Etc.

**gowld** · 2026-03-07

Just prompt the AI to verify the software.

**ironman1478** · 2026-03-07

Verification has always been hard and always ignored, in software more than other industries. This is not specific to AI generated code.

I currently work in a software field that has a large numerical component and verifying that the system is implemented correctly and stable takes much longer than actually implementing it. It should have been like that when I used to work in a more software-y role, but people were much more cavalier then and it bit that company in the butt often. This isn't new, but it is being amplified.

**fishtoaster** · 2026-03-07

Figuring out how to trust AI-written code faster is *the* project of software engineering for the next few years, IMO.

We'll need to figure out the techniques and strategies that let us merge AI code sight unseen. Some ideas that have already started floating around:

\- Include the spec for the change in your PR and only bother reviewing *that*, on the assumption that the AI faithfully executed it

\- Lean harder on your deterministic verification: unit tests, full stack tests, linters, formatters, static analysis

\- Get better ai-based review: greptile and bugbot and half a dozen others

\- Lean into your observability tooling so that AIs can fix your production bugs so fast they don't even matter.

None of these seem fully sufficient right now, but it's such a new problem that I suspect we'll be figuring this out for the next few years at least. Maybe one of these becomes the silver bullet or maybe it's just a bunch of lead bullets.

But anyone who's able to ship AI code without human review (and without their codebase collapsing) will run circles around the rest.

**orsorna** · 2026-03-07

\>Lean harder on your deterministic verification: unit tests, full stack tests, linters, formatters, static analysis

It's wild that the gamut of PRs being zipped around don't even do these. You would run such validations as a human...

**gjsman-1000** · 2026-03-07

Do you know what happens to every industry when they get too fast and slapdash?

Regulation.

It happened with plumbing. Electricians. Civil engineers. Bridge construction. Haircutting. Emergency response. Legal work. Tech is perhaps the least regulated industry in the world. Cutting someone’s hair requires a license, operating a commercial kitchen requires a license, holding the SSN of 100K people does not *yet*.

If AI is fast and cheap, some big client will use it in a stupid manner. Tons of people can and will be hurt afterward. Regulation will follow. AI means we can either go faster, or focus on *ironing out every last bug* with the time saved, and politicians will focus on the latter instead of allowing a mortgage meltdown in the prime credit market. Everyone stays employed while the bar goes higher.

**hackyhacky** · 2026-03-07

\> Regulation will follow.

I would hope so, but it won't happen as long as the billionaire AI bros keep on paying politicians for favorable treatment.

**leptons** · 2026-03-07

The word is "bribing", and the current (bribable) administration won't be around forever (hopefully).

**disgruntledphd2** · 2026-03-08

At the very least, the EU will regulate, and most other countries will copy. At that point the US will either need to regulate or watch it's software exports go to zero, with consequent impacts on their stock markets.

I've been saying this for a while, but within a generation, software will be as regulated as finance.

**coffeefirst** · 2026-03-07

He’s right. Exhibit A is age-gating social media. If the industry keeps being this careless that’s going to be the tip of the iceberg.

**threatofrain** · 2026-03-08

It's not just going to be software. We will absolutely be experiencing vibe law, vibe medicine, vibe legislation even. It'll be so much vibing that it's not worth saying the word anymore.

**zer00eyz** · 2026-03-07

\> Include the spec for the change in your PR

We would have to get very good at these. It's completely antithetical to the agile idea where we convey tasks via pantomime and post it rather than formal requirements. I wont even get started on the lack of inline documentation and its ongoing disappearance.

\> Lean harder on your deterministic verification: unit tests, full stack tests,

Unit tests are so very limited. Effective but not the panacea that the industry thought it was going to be. The conversation about simulation and emulation needs to happen, and it has barely started.

\> We'll need to figure out the techniques and strategies that let us merge AI code sight unseen.

Most people who write software are really bad at reading other's code, and doing systems level thinking. This starts at hiring, the leet code interview has stocked our industry with people who have never been vetted, or measured on these skills.

\> But anyone who's able to ship AI code without human review

Imagine we made every one go back to the office, and then randomly put LSD in the coffee maker once a week. The hallucination problem is always going to be NON ZERO. If you are bundling the context in, you might not be able to limit it (short of using two models adversarially). That doesn't even deal with the "confidently wrong" issue... what's an LLM going to do with something like this: [https://news.ycombinator.com/item?id=47252971](https://news.ycombinator.com/item?id=47252971) (random bit flips).

We haven't even talked about the human factors (bad product ideas, poor UI, etc) that engineers push back against and an LLM likely wont.

That doesn't mean you're completely wrong: those who embrace AI as a power tool, and use it to build their app, and tooling that increases velocity (on useful features) are going to be the winners.

**sarchertech** · 2026-03-07

Translating from a natural language spec to code involves a truly massive amount of decision making.

For a non trivial program, 2 implementations of the same natural language spec will have thousands of observable differences.

Where we are today, that is agents require guardrails to keep from spinning out, there is no way to let agents work on code autonomously that won’t end up with all of those observable differences constantly shifting, resulting in unusable software.

Tests can’t prevent this because for a test suite to cover all observable behavior, it would need to be more complex than the code. In which case, it wouldn’t be any easier for machine or human to understand.

The only solution to this problem is that LLMs get better. Personally I think at the point they can pull this off, they can do any white collar job, and there’s not point in planning for that future because it results in either Mad Mad or Star Trek.

**logicchains** · 2026-03-07

\>For a non trivial program, 2 implementations of the same natural language spec will have thousands of observable differences.

If they're not defined in the spec then these differences shouldn't matter, they're just implementation details. And if they do matter, then they should be included in the spec; a natural language spec that doesn't specify some things that should be specified is not a good spec.

**sarchertech** · 2026-03-07

There are a limitless number of implementation details you don't think you care about until they are constantly changing.

I doubt there exists a single piece of nontrivial software today where you could randomly alter 5% of the implementation details while keeping to the spec, without resulting in a flood of support tickets.

**halfcat** · 2026-03-07

\> *we just need to make the spec perfect*

So, never.

Greg Kroah-Hartman was once asked by his boss, *”when will Linux be done?”* and he said, *”when people stop making new hardware”*, that even today, when we assume the hardware won’t lie, much of the work in maintaining Linux is around *hardware bugs*.

So even at the lowest levels of software development, you can’t know the bugs you’re going to have until you partially solve the problem and find out that this combination of hardware and drivers produces an error, and you only find that out because someone with that combination tried it. There is no way to prevent that by “make better spec”.

But that’s always been true. Basically it’s the 3-body-problem. On the spectrum of simple-complicated-complex, you can calculate the future state of a system if it’s simple, or “only complicated” (sometimes), but you literally cannot know the future state of complex systems without simulating them, running each step and finding out.

And it gets worse. Software ranges from simple to complicated to complex. But it exists within a complex hardware environment, and also within a complex business environment where people change and interest rates change and motives change from month to month.

There is no “correct spec”.

**Herring** · 2026-03-07

Agreed, but with one exception: are tests supposed to cover all observable behavior? Usually people are happy with just eliminating large/easy classes of bad (unintended) behavior, otherwise they go for formal verification which is an entirely different ballgame.

**sarchertech** · 2026-03-07

No they aren’t because they can’t (at least not without becoming so complicated that there’s no longer a point).

But humans are much better at reasoning about whether a change is going to impact observable behavior than current LLMs are as evidenced by the fact that LLMs *require* a test suite or something similar to build a working app longer than a few thousand lines.

**wtallis** · 2026-03-07

\> Tests can’t prevent this because for a test suite to cover all observable behavior, it would need to be more complex than the code. In which case, it wouldn’t be any easier for machine or human to understand.

I don't think "complex" is the right word here. A test suite would generally be more *verbose* than the implementation, but a lot of the time it can simply be a long list of input->output pairs that are individually very comprehensible and easily reviewable to a human. The hard part is usually discovering what *isn't* covered by the test case, rather than validating the correctness of the test cases you do have.

**wizzwizz4** · 2026-03-07

If some of those input-output pairs are the result of a different interpretation of the spec to other input-output pairs, it's possible that *no* program satisfies all the tests (or, worse, that a program that satisfies all the tests isn't correct).

**sarchertech** · 2026-03-08

At some point verbosity becomes complexity. If you’re talking all observable behavior the input and output pairs are likely to be quite verbose/complex.

Imagine testing a game where the inputs are the possible states of game, and the possible control inputs, and the outputs are the states that could result.

Of course very few human written programs require this level of testing, but if you are trying to prevent an a swarm of agents from changing observable behavior without human review, that’s what you’d need.

Even with simpler input output pairs, an AI tells you it added a feature and had to change 2,000 input/output pairs to do so. How do you verify that those were necessary to change, and how do you verify that you actually have enough cases to prevent the AI from doing something dumb?

Oops you didn’t have a test that said that items shouldn’t turn completely transparent when you drag them.

**skydhash** · 2026-03-08

Code is like f(x)=ax+b. You test would be a list of (x,y) tuple. You don’t verify the correctness of your points because they come from some source that you hold as true. What you want is the generic solution (the theory) proposed by the formula. And your test would be just a small set of points, mostly to ensure that no one has changed the a and b parameters. But if you have a finite number of points, The AI is more likely to give you a complicated spline formula than the simple formula above. Unless the tokens in the prompts push it to the right domain space. (Usually meaning that the problem is solved already)

Real code has more dimensionality than the above example. Experts have the right keywords, but even then that’s a whole of dice. And coming up with enough sample test cases is more arduous than writing the implementation.

Unless there’s no real solution (dimensionality is high), but we have a lot of tests data with a lower dimensionality than the problem. This used to be called machine learning and we have metrics like accuracy for it.

**user3939382** · 2026-03-07

I made a distributed operating system that manages all of this. Not just for agents per se but in general allows many devs to work simultaneously without tons of central review and allows them to keep standards high while working independently.

**chromaton** · 2026-03-07

Historically, the cycle has been requirements -> code -> test, but with coding becoming much faster, the bottlenecks have changed. That's one of the reasons I've been working on Spark Runner to help automate testing for web apps: https://[https://github.com/simonarthur/spark-runner](https://github.com/simonarthur/spark-runner)

**bensyverson** · 2026-03-07

It comes down to trust. I was not able to trust GPT 4.1 or Sonnet 3.5 with anything other than short, well-specified tasks. If I let them go too long (e.g. in long Cursor sessions), it would lose the plot and start thrashing.

With better models and harnesses (e.g. Claude Code), I can now trust the AI more than I would trust a junior developer in the past.

I still review Claude's plans before it begins, and I try out its code after it finishes. I do catch errors on both ends, which is why I haven't taken myself out of the loop yet. But we're getting there.

Most of the time, the way I "verify" the code is behavioral: does it do what it's supposed to do? Have I tried sufficient edge cases during QA to pressure-test it? Do we have good test coverage to prevent regressions and check critical calculations? That's about as far as I ever took human code verification. If anything, I have *more* confidence in my codebases now.

**cuntiusmccunt** · 2026-03-07

good moooorning sir

**jldugger** · 2026-03-07

Verification debt has always been present, we just now feel an acute need for it, because we do it wrong.

Clause and friends represent an increase in coders, without any corresponding increase in code reviewers. It's a break in the traditional model of reviewing as much code as you submit, and it all falls on human engineers, typically the most senior.

Well, that model kinda sucked anyways. Humans are falliable and Ironies of Automation lays bare the failure modes. We all know the signs: 50 comments on a 5 line PR, a lonely "LGTM" on the 5000 line PR. This is not responsible software engineering or design; it is, as the author puts it, a big green "I'm accountable" button with no force behind it.

It's probably time for all of us on HN to pick up a book or course on TLA+ and elevate the state of software verification. Even if Claude ends up writing TLA+ specs too, at least that will be a smaller, simpler code base to review?

**pcloadlett3r** · 2026-03-08

Will the TLA+ spec Claude spits out do what the users actually desire? Will there be human oversight of the spec? If not, I don't see how it really helps if the future human machine interface is supposed to be loosey goosey natural language. The best thing I can conceive is some human observers of the system saying "Claude, the behavior as it stands now is perfect! Set it in stone with TLA+." But this whimsical idea has many problems.

**jldugger** · 2026-03-08

\> Will there be human oversight of the spec?

Well that's my suggestion, but I suppose nothing rules out an "all apprentices, no sorcerers" failure mode.

**abetusk** · 2026-03-07

Both empirically and theoretically, verification is often much more tractable than discovery.

Software development is a highly complex task and verification becomes not just validation of the output but also verification that the work is solving the problem desired, not just the problem specified.

I'm empathetic to that scenario, but this was a problem with software development to begin with. I would much rather be in a situation of reducing friction to verification than reducing friction to discovery.

Cognitive load might be the same but now we get a potential boost in productivity for the same cost.

**ritcgab** · 2026-03-07

At the end of the day, it's about liability. Whether you use AI tools to generate the code or not, you are the author of the code, and such authorship implies the liability that you are being paid to take.

**poemxo** · 2026-03-07

We were verifying code before? And wouldn't AI help with verification at least for the trivial flaws?

**mentalgear** · 2026-03-07

\> Output is mind-numbingly verbose. You ask for a focused change and get a dissertation with unsolicited comments and gratuitous refactoring.

Recent Devstral 2 (mistral) is pretty precise and concise in it's changes.

**talkvoix** · 2026-03-07

With a CS degree and 15 years of software engineering under my belt, I was initially skeptical of 'vibe coding'. But the article is right about this adolescent phase. I recently built my platform ([https://voix.chat](https://voix.chat)) 100% through agentic workflows. Having that much experience meant I didn't use the AI as a crutch to learn how to code; I used it as a hyper-productive junior dev while I played the paranoid senior architect. It allowed me to focus purely on the hard stuff: strict anti-flood mechanisms, brute-force protection, and overall server hardening. The AI handles the syntax; the human handles the paranoia.

**NewsaHackO** · 2026-03-07

Your FAQ page is in Portuguese, even though my language is set to English. Changing the language does not seem to change the FAQ. Did you forget to localize this?

**talkvoix** · 2026-03-08

I just fixed that! Thank you so much for letting me know. I had forgotten to upload that commit, haha!

Could you refresh the page and test it?

**hamasho** · 2026-03-08

I've been spending much less time on reviews lately. I used to check if the code was correct and well-written, and worked on my local machine as expected and performed well. But I can't do it anymore. If they can vibe-code, why can't I vibe-review? Maybe something wrong will happen in production, but it's not my responsibility. I also stopped volunteering for on-call (well, I shouldn't in the first place). If I noticed someone reporting a bug in production during non-working hours, I investigated and implemented the solution, usually faster than coworkers. I thought it was my responsibility to contribute to the product if I could, even though it was beyond my job description. Working with AI-generated code really demoralized me and I can't love the product I'm working on anymore.

**SPascareli13** · 2026-03-08

My current stance with reviewing code is: It's not ok to make another human review the code you made with AI, if you used AI then you're the reviewer, so unless you come to me with a well defined question or decision to make, just merge it and take responsibility.

Obviously that could only work in a high trust environment, that why open source suffers so much with AI submissions.

**cadamsdotcom** · 2026-03-08

Software is a huge collection of tiny, curated details.

Verifying that they all work can be done in many ways, most of them high-touch - but to me the most effective way is to build a test suite.

And the best way to get a test suite while building is Test Driven Development TDD (with the key trait that you *witnessed the tests fail* before making them pass, giving you proof they actually prove something about your code) is a high leverage way to ensure details are documented and codified in a way that requires “zero tokens at rest”. If a test fails, something has been un-built; something has regressed. Conversely if all tests pass, your agent burned zero tokens learning that.

The industry will keep inventing other solutions but we have this already, so if you’re in the know, you should use it.

If you’re wondering how to get started you (or your agent) can crib ideas from what I’ve done & open sourced: [https://codeleash.dev/docs/tdd-guard/](https://codeleash.dev/docs/tdd-guard/)

**mrothroc** · 2026-03-08

Everyone is circling around this. We are shifting to "code factories" that take user intent in at one end and crank out code at the other end. The big question: can you trust it?

We're building our tooling around it (thanks, Claude!) and seeing what works. Personally, I have my own harness and I've been focused on 1) discovering issues (in the broadest sense) and 2) categorizing the issues into "hard" and "easy" to solve inside the pipeline itself.

I found patterns in the errors the coding agents made in my harness, which I then exploited. I have an automated workflow that produces code in stages. I added structured checks to catch the "easy" problems at stage boundaries. It fixes those automatically. It escalates the "hard" problems to me.

In the end, this structure took me from ~73% first-pass to over 90%.

**devld** · 2026-03-08

\> Mostly I’m just there to press the big “I’m accountable” button on the screen

This is going to be way harder now vs. when we used to write the code ourselves. In contracting space, the problem now is that you may have a client that vibe coded an app and be very out of touch about the costs involved to have a developer approve it. It's going to be a hard sell, when the client builds the entire thing themselves and you are a mare peasant doing QA review.

**rekornode** · 2026-03-09

There's a related but distinct problem downstream: once the agent is running in production, verification debt shifts from code to execution. Internal logs of what the agent called and what it received are mutable — if a provider disputes delivery or compliance requires an audit trail, "we have logs" is a weak defense. The deterministic verification (tests, linters, CI) handles the code side. The execution side is a different problem: you need immutable witnesses at call time, before the agent proceeds, not post-hoc reconstructions.
