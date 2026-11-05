---
title: "When AI writes the software, who verifies it?"
author: "todsacerdoti | 305 points | 2026-03-03"
published: 2026-03-03
source: https://news.ycombinator.com/item?id=47234917
date: 2026-09-07T05:39:18.123Z
---

[https://leodemoura.github.io/blog/2026/02/28/when-ai-writes-the-worlds-software.html](https://leodemoura.github.io/blog/2026/02/28/when-ai-writes-the-worlds-software.html)

## Comments (83)

**rademaker** · 2026-03-03

In his latest essay, Leonardo de Moura makes a compelling case that if AI is going to write a significant portion of the world’s software, then verification must scale alongside generation. Testing and code review were never sufficient guarantees, even for human-written systems; with AI accelerating output, they become fundamentally inadequate. Leo argues that the only sustainable path forward is machine-checked formal verification — shifting effort from debugging to precise specification, and from informal reasoning to mathematical proof checked by a small, auditable kernel. This is precisely the vision behind Lean: a platform where programs and proofs coexist, enabling AI not just to generate code, but to generate code with correctness guarantees. Rather than slowing development, Lean-style verification enables trustworthy automation at scale.

**righthand** · 2026-03-03

No one really. Code is for humans to read and for machines to compile and execute. Llms are enabling people to just write the code and not have anyone read it. It’s solving a problem that didn’t really exist (we already had code generators before llms).

It’s such an intoxicating copyright-abuse slot machine that a buddy who is building an ocaml+htmx tree editor told me “I always get stuck and end up going to the llm to generate code. Usually when I get to the html part.” I asked if he used a debugger before that, he said “that’s a good idea”.

**galbar** · 2026-03-03

This is something I've been wondering about...

If boilerplate was such a big issue, we should have worked on improving code generation. In fact, many tools and frameworks exist that did this already:

\- rails has fantastic code generation for CRUD use cases

\- intelliJ IDEs have been able to do many types of refactors and class generation that included some of the boilerplate

I haven't reached a conclusion on this train of thought yet, though.

**righthand** · 2026-03-03

Pre-llm corpos my thoughts were that we should be training juniors on code generators. Instead we’re somewhere between rtfm or dont.

**acedTrex** · 2026-03-03

No one does currently, and its going to take a few very painful and high profile failures of vital systems for this industry to RELEARN its lesson about the price of speed.

In fact it will probably need to happen a few times PER org for the dust to settle. It will take several years.

**arscan** · 2026-03-03

Sure but industry cares about value (= benefit - price), not just price. Price could be astronomical, but that doesn’t matter if benefit is larger.

**jcgrillo** · 2026-03-03

I feel like people used to talk about nines of uptime more. As in more than one. These days we've lost that: [https://bsky.app/profile/jkachmar.com/post/3mg4u3e6nak2p](https://bsky.app/profile/jkachmar.com/post/3mg4u3e6nak2p)

I recall a time, maybe around 2013-2017, when people were talking about 4 or 5 nines. But sometime around then the goalposts shifted, and instead of trying to make things as reliable as possible, it started becoming more about seeing how unreliable they can get before anyone notices or cares. It turns out people will suffer through a lot if there's some marginal benefit--remember what personal computers were like in the 1990s before memory protection? Vibe coding is just another chapter in that user hostile epic. Convenient reliability, like this author describes, (if it can be achieved) might actually make things better? But my money isn't on that.

**foolfoolz** · 2026-03-03

no one wants to believe this but there will be a point soon when an ai code review meets your compliance requirements to go to production. is that 2026? no. but it will come

**righthand** · 2026-03-03

We already have specifications though, so that’s not different. What happens when the AI is wrong and wont let anyone deploy to production?

**oakpond** · 2026-03-03

You do. Even the latest models still frequently write really weird code. The problem is some developers now just submit code for review that they didn't bother to read. You can tell. Code review is more important than ever imho.

**MrDarcy** · 2026-03-03

It is remarkably effective to have Claude Code do the code review and assign a quality score, call it a grade, to the contribution derived from your own expectations of quality.

Then don’t even bother looking at C work or below.

**NitpickLawyer** · 2026-03-03

IME it works even better if you use another model for review. We've seen code by cc and review by gpt5.2/3 work very well.

Also works with planning before any coding sessions. Gemini + Opus + GPT-xhigh works to get a lot of questions answered before coding starts.

**sausagefeet** · 2026-03-03

I agree with you. But I have to say, it is an uphill battle and all the incentives are against you.

1\. AI is meant to make us go faster, reviews are slow, the AI is smart, let it go.

2\. There are plenty of AI maximizers who only think we should be writing design docs and letting the AI go to town on it.

Maybe, this might be a great time to start a company. Maximize the benefits of AI while you can without someone who has never written a line of code telling you that your job is going to disappear in 12 months.

All the incentives are against someone who wants to use AI in a reasonable way, right now.

**redhed** · 2026-03-03

I actually agree with good time to start a company. Lot of available software engineers that can actually understand code, AI at a level that can actually speed up development, and so many startups focusing on AI wrapper slop that you can actually make a useful product and separate yourself from the herd.

Or you can be a grifter and make some AI wrapper yourself and cash out with some VC investment. So good time for a new company either way.

**radlad** · 2026-03-03

It's gonna be like that HBO Silicon Valley bit again, where everyone and their doctor is telling you about their app.

**rvz** · 2026-03-04

The people that are declaring holier-than-thou with self proclaimed 'principles' are the worst grifters and the ones actively scamming with AI with VC investment.

Pretending that they can only save the world and at the same time declaring they don't use AI but use it secretly by building an so-called "AI startup" and then going on the media doomsaying that "AGI" is coming.

At this point in this cycle in AI, "AGI" is just grifting until IPO.

**xienze** · 2026-03-03

\> The problem is some developers now just submit code for review that they didn't bother to read.

Can you blame them? All the AI companies are saying “this does a better job than you ever could”, every discussion topic on AI includes at least one (totally organic, I’m sure) comment along the lines of “I’ve been developing software for over twenty years and these tools are going to replace me in six months. I’m learning how to be a plumber before I’m permanently unemployed.” So when Claude spits out something that seems to work with a short smoke test, how can you blame developers for thinking “damn the hype is real. LGTM”?

**jf22** · 2026-03-03

I'm an 99% organic person (I suppose I have tooth fillings) and the new models write code better than I do.

I've been using LLMS for 14+ months now and they've exceeded my expectations.

**xienze** · 2026-03-03

So are you learning a trade? Or do you somehow think you’ll be one of the developers “good enough” to remain employed?

**HoldOnAMinute** · 2026-03-03

Not only do they exceed expectations, but any time they fall down, you can improve your instructions to them. It's easy to get into a virtuous cycle.

**bluefirebrand** · 2026-03-03

\> Can you blame them?

Yes I absolutely can and do blame them

**keybored** · 2026-03-03

This is correct. And at this point (and I think you agree?) we have to take that critical thinking skill and stop letting it just happen to us.

It might seem hopeless. But on the other hand the innate human BS detector is quite good. Imagine the state of us if we could be programmed by putting billions of dollars into our brains and not have any kind of subconscious filter that tells us, hey this doesn’t seem right. We’ve already tried that for a century. And it turns out that the cure is not billions of dollars of counter-propaganda consisting of the truth (that would be hopeless as the Truth doesn’t have that kind of money).

We don’t have to be discouraged by whoever replies to you and says things like, oh my goodness the new Siri AI replaced my parenting skills just in the last two weeks, the progress is astounding (Siri, the kids are home and should be in bed by 21:00). Or by the hypothetical people in my replies insisting, no no people are stupid as bricks; all my neighbors buy the propaganda of \[wrong side of the political aisle\]. Etc. etc. ad nauseam.

**bradleykingz** · 2026-03-03

But it's so BORING. AI gets to do the fun part (writing code) and I'm stuck with the lame bits.

It's like watching someone else solve a puzzle, or watching someone else play a game vs playing it yourself (at least that's half as interesting as playing it through)

**lukan** · 2026-03-03

For me the most fun part is getting something that works. Design the goal, but not micromanage and get lost in the details. I love AI for that, but it is hard really owning code this way. (At least I manually approve every or most changes, but still, verifying is hard).

**bitwize** · 2026-03-03

AI has really sharpened the line between the Master Builders of the world and the Lord Businesses along this question: What, exactly, is the "fun part" of programming? Is it simply having something that works? Or is it the process of going from not having it to having it through your own efforts and the sum total of decisions you made along the way?

**jurgenburgen** · 2026-03-04

\> For me the most fun part is getting something that works. Design the goal, but not micromanage and get lost in the details.

That’s management, which is not necessarily bad by itself.

What is bad if you have to be both a manager giving the requirements and the IC responsible for the output. That’s the worst of both worlds.

If it was possible to truly vibe code in the same way a product manager asks a team to build something then we wouldn’t need to have this discussion.

In reality you can never truly trust the output. Ultimately you’re on the hook if production breaks apart, not the LLM.

**HoldOnAMinute** · 2026-03-03

I am really enjoying making requirements docs in an iterative process. I have a continuous improvement loop where I use the implementation to test out the docs. If I find a problem with the docs, I throw away the implementation, improve the docs, then re-implement. The kind of docs I'm getting are of *amazing* quality.

**nz** · 2026-03-03

Your workplace has chosen to deprive you of the enjoyment that you got from the work. You have a few options: (1) ask for a raise proportional to the percentage of enjoyment that you lost, (2) find a workplace that does not do this, or (3) phone it in (they see you and your craft as something be milked for cash, so maybe stop letting yourself get milked, and milk them right back, by doing \_exactly\_ what is asked of you and \_not\_ more -- let these strategic geniuses strategize using their own brains).

**stretchwithme** · 2026-03-03

I can solve a problem in 10% of the time. Dealing with an issue TODAY, instead of having to put it in the backlog.

**mosura** · 2026-03-03

LLMs are still not good at structurally hard problems, and it is doubtful they ever will be absent some drastic extension. (Including continuous learning). In the mean time the trick is creating a framework where you can walk them through the exact stages you would to do it, only it goes way faster. The problem is many people stop at the first iteration that looks like it works and then move on, but you have to keep pushing in the same way you do with humans.

Bluntly though, if what you were doing was CRUD boilerplate then yeah it is going to just be a review fest now, but that kind of work always was just begging to be automated out one way or another.

**throwaw12** · 2026-03-03

\> You do

I really want to say: "You are absolutely right"

But here is a problem I am facing personally (numbers are hypothetical).

I get a review request 10-15/day by 4 teammates, who are generating code by prompting, and I am doing same, so you can guess we might have ~20 PRs/day to review. now each PR is roughly updating 5-6 files and 10-15 lines in each.

So you can estimate that, I am looking at around 50-60 files, but I can't keep the context of the whole file because change I am looking is somewhere in the middle, 3 lines here, 5 lines there and another 4 lines at the end.

How am I supposed to review all these?

**radlad** · 2026-03-03

I don't quite follow - are you describing an issue with the way your team has structured PRs? IMO, a PR should contain just enough code to clearly and completely solve "a thing" without solving too much at once. But what this means in practice depends on the team, product, velocity, etc. It sounds like your PRs might be broken up into too small of chunks if you can't understand why the code is being added.

**throwaw12** · 2026-03-03

I am saying PRs I get are around 60-70 lines of change, which is small enough to be considered as single unit (add to this unit tests which must pass with new change, so we are talking about 30 line change + 30 line unit test)

But when looking at the PR changes, you don't always see whole picture because review subjects (code lines) are scattered across files and methods, and GitHub also shows methods and files partially making it even more difficult to quickly spot the context around those updated lines.

Its difficult problem, because even if GitHub shows whole body of the updated method or a file, you still don't see grand picture.

For example: A (calls) -> B -> C -> D

And you made changes in D, how do you know the side effect on B, what if it broke A?

**jra\_samba** · 2026-03-03

Tests. All changes must have tests. If they're generating the code, they can generate the tests too.

**throwaw12** · 2026-03-03

who reviews the tests? again me? -> that's exactly why I am saying review is a bottleneck, especially with current tooling, which doesn't show second order impacts of the changes and its not easy to reason about when method gets called by 10 other methods with 4 level of parent hierarchy

**ptnpzwqd** · 2026-03-03

If reviewing has become the bottleneck, the obvious - albeit slightly boring - solution is to slow down spitting out new code, and spend relatively more time reviewing.

Just going ahead and piling up PRs or skipping the review process is of course not recommended.

**throwaw12** · 2026-03-03

you are not wrong, but solution you are proposing is just throttling the system because of the bottleneck, and it doesn't solve the bottleneck problem.

**sjajzh** · 2026-03-03

Ideally, you’re working with teammates you trust. The best teams I’ve worked on reviews were a formality. Most of the time a quick scan and a LGTM. We worked together prior to the review as needed on areas we knew would need input from others.

AI changes none of this. If you’re putting up PRs and getting comments, you need to slow down. Slow is smooth, and smooth is fast.

I’ll caveat this with that’s only if your employer cares about quality. If you’re fine passing that on to your users, might as well just stop reviewing all together.

**throwaw12** · 2026-03-03

\> Ideally, you’re working with teammates you trust.

I do trust them, but code is not theirs, prompt is. What if I trust them, but because how much they use LLMs their brain started becoming lazy and they started missing edge cases, who should review the code? me or them?

At the beginning, I relied on my trust and did quick scans, but eventually noticed they became un-interested in the craft and started submitting LLM output as it is, I still trust them as good faith actors, but not their brain anymore (and my own as well).

Also, assumption is based on ideal team: where everyone behaves in good faith. But this is not the case in corporations and big tech, especially when incentives are aligned with the "output/impact" you are making. A lot of times, promoted people won't see the impact of their past bad judgements, so why craft perfect code

**\_pdp\_** · 2026-03-03

I think the issue goes even deeper than verification. Verification is technically possible. You could, in theory, build a C compiler or a browser and use existing tests to confirm it works.

The harder problem is discovery: how do you build something entirely new, something that has no existing test suite to validate against?

Verification works because someone has already defined what "correct" looks like. There is possible a spec, or a reference implementation, or a set of expected behaviours. The system just has to match them.

But truly novel creation does not have ground truth to compare against and no predefined finish line. You are not just solving a problem. You are figuring out what the problem even is.

**Avshalom** · 2026-03-03

Well that's a problem the software industry has been building for itself for decades.

Software has, since at least the adoption of "agile" created an industry culture of not just refusing to build to specs but insisting that specs are impossible to get from a customer.

**daveguy** · 2026-03-03

Agile hasn't been insisting that specs are impossible to get from a customer. They have been insisting that getting specs from a customer is best performed as a dynamic process. In my opinion, that's one of agile's most significant contributions. It lines up with a learning process that doesn't assume the programmer or the customer knows the best course ahead of time.

**skydhash** · 2026-03-03

And good luck when getting misaligned specs (communication issues customer side, docs that are not aligned with the product,...). Drafting specs and investigating failure will require both a diplomat hat and a detective hat. Maybe with the developer hat, we will get DDD being meaningful again.

**bunderbunder** · 2026-03-03

I have found that it works well as an open-endlessly dynamic process when you are doing the kind of work that the people who came up with Scrum did as their bread and butter: limited-term contract jobs that were small enough to be handled by a single pizza-sized team and whose design challenges mostly don’t stray too far outside the Cynefn clear domain.

The less any of those applies, the more costly it is to figure it out as you go along, because accounting for design changes can become something of a game of crack the whip. Iterative design is still important under such circumstances, but it may need to be a more thoughtful form of iteration that’s actively mindful about which kinds of design decisions should be front-loaded and which ones can be delayed.

**pydry** · 2026-03-03

Agile is a pretty badly defined beast at the best of times but even the most twisted interpretation doesnt mean that. It's mainly just a rejection of BDUF.

**user3939382** · 2026-03-04

I don’t want to put words in your mouth but I think I agree. It’s called requirements engineering. It’s hard, but it’s possible and waterfall works fine for many domains. Agile teams I see burning resources doing the same thing 2-3x or sprinting their way into major, costly architectural mistakes that would have been easily avoided by upfront planning and specs.

**bigfishrunning** · 2026-03-04

I *always* try to get the customer to provide specs, and failing that, to agree to specs before we start working. It's usually very difficult.

**galaxyLogic** · 2026-03-04

There's two ways of thinking about tests:

A) They let you verify that implementation passes its spec, more or less.

B) They are a (trustworthy) description of how the system behaves, they allow you to understand the system better.

**holtkam2** · 2026-03-03

At the end of the day you need humans who understand the business critical (or safety critical) systems that underpin the enterprise.

Someone needs to be held accountable when things go wrong. Someone needs to be able to explain to the CEO why this or that is impossible.

If you want to have AI generate all the code for your business critical software, fine, but you better make sure you understand it well. Sometimes the fastest path to deep understanding is just coding things out yourself - so be it.

This is why the truly critical software doesn’t get developed much faster when AI tools are introduced. The bottleneck isn’t how fast the code can be created, it’s how fast humans can construct their understanding before they put their careers on the line by deploying it.

Ofc… this doesn’t apply to prototypes, hackathons, POCs, etc. for those “low stakes” projects, vibe code away, if you wish.

**sjajzh** · 2026-03-03

I think this gets to the heart of it. We’re gonna see a new class of devs & software emerge that only use AI and don’t read the code. The devs that understand code will still exist too, but there is certainly an appetite for going faster at the cost of quality.

I personally find the “move fast and break thing” ethos morally abhorrent, but that doesn’t make it go away.

**lgl** · 2026-03-03

I'm in the process of building v2.0 of my app using opus 4.6 and largely agree with this.

It's pretty awesome but still does a lot of basic idiotic stuff. I was implementing a feature that required a global keyboard shortcut and asked opus to define it, taking into account not to clash with common shortcuts. He built a field where only one modifier key was required. After mentioning that this was not safe since users could just define CTRL+C for the shortcut and we need more safeguards and require at least two modifier keys I got the usual "you're absolutely right" and proceeded to require two modifier keys. But then it also created a huge list of common shortcuts into a blacklist like copy, cut, paste, print, select all, etc.. basically a bunch of single modifier key shortcuts. Once I mentioned that since we're already forcing two modifier keys that's useless it said I'm right again and fixed it.

The counter point of this idiocy is that it's very good overall at a lot of what is (in my mind) much more complicated stuff. It's a .NET app and stuff like creating models, viewmodels, usercontrols, setting up the entire hosting DI with pretty much all best practices for .net it does it pretty awesomely.

tl;dr is that training wheels are still mandatory imho

**indymike** · 2026-03-03

Because of the scale of generated code, often it is the AI verifying the AI's work.

**tartoran** · 2026-03-03

So who's verifying the AI doing the verifying or is it yet another AI layer doing that? If something goes wrong who's liable, the AI?

**visarga** · 2026-03-03

You have 2 paths - code tests and AI review which is just vibe test of LGTM kind, should be using both in tandem, code testing is cheap to run and you can build more complex systems if you apply it well. But ultimately it is the user or usage that needs to direct testing, or pay the price for formal verification. Most of the time it is usage, time passing reveals failure modes, hindsight is 20/20.

**ptnpzwqd** · 2026-03-03

I of course cannot say what the future holds, but current frontier models are - in my experience - nowhere near good enough for such autonomy.

Even with other agents reviewing the code, good test coverage, etc., both smaller - and every now and then larger - mistakes make their way through, and the existence of such mistakes in the codebase tend to accellerate even more of them.

It for sure depends on many factors, but I have seen enough to feel confident that we are not there yet.

**simonw** · 2026-03-03

The "Nearly half of AI-generated code fails basic security tests" link provided in this piece is not credible in my opinion. It's a *very* thinly backed vendor report from a company selling security scanning software.

**muraiki** · 2026-03-03

The article says that AWS's Cedar authorization policy engine is written in Lean, but it's actually written in Dafny. Writing Dafny is a lot closer to writing "normal" code rather than the proofs you see in Lean. As a non-mathematician I gave up pretty early in the Lean tutorial, while in a recent prototype I learned enough Dafny to be semi-confident in reviewing Claude's Dafny code in about half a day.

The Dafny code formed a security kernel at the core of a service, enforcing invariants like that an audit log must always be written to prior to a mutating operation being performed. Of course I still had bugs, usually from specification problems (poor spec / design) or Claude not taking the proof far enough (proving only for one of a number of related types, which could also have been a specification problem on my part).

In the end I realized I'm writing a bunch of I/O bound glue code and plain 'ol test driven development was fine enough for my threat model. I can review Python code more quickly and accurately than Dafny (or the Go code it eventually had to link to), so I'm back to optimizing for humans again...

**dranov** · 2026-03-04

Cedar used to be written in Dafny, but AWS abandoned that implementation and rewrote it in Lean.

[https://aws.amazon.com/blogs/opensource/lean-into-verified-s...](https://aws.amazon.com/blogs/opensource/lean-into-verified-software-development/)

**muraiki** · 2026-03-04

Oh whoops, thank you for the correction! I didn't realize that.

**cpeterso** · 2026-03-04

Looks like LLMs also find Dafny easier to write than Lean. This study, “A benchmark for vericoding: formally verified program synthesis”, reports:

\> We present and test the largest benchmark for vericoding, LLM-generation of formally verified code from formal specifications … We find vericoding success rates of 27% in Lean, 44% in Verus/Rust and 82% in Dafny using off-the-shelf LLMs.

[https://arxiv.org/html/2509.22908v1](https://arxiv.org/html/2509.22908v1)

**nextos** · 2026-03-04

Not surprising, as Dafny is a bit less expressive (refinement instead of dependent types) and therefore easier to write. IMHO, it hits a very nice sweet spot. The disadvantage of Dafny is the lack of manual tactics to prove things when SAT/SMT automation fails. But this is getting fixed.

**JuniperMesos** · 2026-03-04

There's multiple Lean tutorials, some of which are more mathy than others. One of the things I like about Lean is precisely that it's an ordinary, Haskell-style functional programming language in addition to having all the Curry-Howard-isomorphism-based mathematical proof machinery. You can write \`cat\` in Lean.

**yoaviram** · 2026-03-03

I just finished writing a post about exactly this. Software development, as the act of manually producing code, is dying. A new discipline is being born. It is much closer to proper engineering.

Like an engineer overseeing the construction of a bridge, the job is not to lay bricks. It is to ensure the structure does not collapse.

The marginal cost of code is collapsing. That single fact changes everything.

[https://nonstructured.com/zen-of-ai-coding/](https://nonstructured.com/zen-of-ai-coding/)

**MattDaEskimo** · 2026-03-03

Accountability then

**yoaviram** · 2026-03-03

Anticipating modes of failure, creating tooling to identify and hedge against risks.

**sjajzh** · 2026-03-03

If we could do this it would have been done already. Outsourced devs would be ubiquitous.

**skydhash** · 2026-03-03

\> I just finished writing a post about exactly this. Software development, as the act of manually producing code, is dying.

It was never that. Take any textbook on software engineering and the focus was never the code, but on systems design and correctness. I'm looking at the table of contents of one (Software Engineering by David C. Kung) and these are a few sample chapters:

```
  ...
  4. Software Requirement Elicitation
  5. Domain Modelling
  6. Architectural Design
  ...
  8. Actor-System Interaction Modeling
  9. Object Interaction Modeling
  ...
  15. Modeling and Design of Rule-Based Systems
  ...
  19. Software Quality Assurance
  ...
  24. Software Security

```
What you're talking about was coding, which has never been the bottleneck other than for beginners in some programming languages.

**shinycode** · 2026-03-03

Our CEO, an expert in marketing has discovered Claude Code and is the one having the most open PR of all developers and is pushing for us to « quickly review ». He does not understand why review are so slow because it’s « the easiest part ». We live in a new world.

**imiric** · 2026-03-04

In what world do these new tools help with "laying bricks", but not with ensuring that the structure does not collapse? How is that work any more difficult than producing the software in the first place? It wasn't that long ago that these tools could barely produce a simple program. If you're buying into the promises of this tech, then what's stopping it from also being able to handle those managerial tasks much better than a human?

The seemingly profound points of your marketing slop article ignore that these new tools are not a higher level of abstraction, but a replacement of all cognitive work. The tech is coming for your job just as it is coming for the job of the "bricklayer" you think is now worthless. The work you're enjoying now is just a temporary transition period, not an indication of the future of this industry.

If you enjoy managing a system that hallucinates solutions and disregards every other instruction, that's great. When you reach a dead end with that approach, and the software is exposing customer data, or failing in unpredictable ways, hopefully you know some good "bricklayers" that can help you with that.

**bitwize** · 2026-03-03

Also AI.

**madrox** · 2026-03-03

I encourage everyone to RTFA and not just respond to the headline. This really is a glimpse into where the future is going.

I've been saying "the last job to be automated will be QA" and it feels more true every day. It's one thing to be a product engineer in this era. It's another to be working at the level the author is, where code needs to be verifiable. However, once people stop vibing apps and start vibing kernels, it really does fundamentally change the game.

I also have another saying: "any sufficiently advanced agent is indistinguishable from a DSL." I hadn't considered Lean in this equation, but I put these two ideas together and I feel like we're approaching some world where Lean eats the entire agentic framework stack and the entire operating system disappears.

If you're thinking about building something today that will still be relevant in 10 years, this is insightful.

**charlieflowers** · 2026-03-03

\> "any sufficiently advanced agent is indistinguishable from a DSL."

I don't quite follow but I'd love to hear more about that.

**esafak** · 2026-03-03

[https://en.wikipedia.org/wiki/Clarke's\_three\_laws](https://en.wikipedia.org/wiki/Clarke's_three_laws)

**charlieflowers** · 2026-03-03

No i get the clarke reference. But how is an agent a dsl?

**jpollock** · 2026-03-03

If the llm is able to code it, there is enough training data that youight be better off in a different language that removes the boilerplate.

**madrox** · 2026-03-03

If you give an agent a task, the typical agentic pattern is that it calls tools in some non-deterministic loop, feeding the tool output back into the LLM, until it deems the task complete. The LLM internalizes an algorithm.

Another way of doing it is the agent just writes an algorithm to perform the task and runs it. In this world, tools are just APIs and the agent has to think through its entire process end to end before it even begins and account for all cases.

Only latter is turing complete, but the former approaches the latter as it improves.

**thinkling** · 2026-03-03

My read was roughly that agents require constraining scaffolding (CLAUDE.md) and careful phrasing (prompt engineering) which together is vaguely like working in a DSL?

**bwestergard** · 2026-03-03

I am as enthusiastic about formal methods as the next guy, but I very much doubt any LLM-based technique will make it economical to write a substantial fraction of application software in Lean. The LLM can play a powerful heuristic role in searching for proof-bearing code in areas where there is good training data. Unfortunately those areas are few and far between.

Moreover, humans will still need to read even rigorously proved code if only to suss out performance issues. And training people to read Lean will continue to be costly.

Though, as the OP says, this is a very exciting time for developing provably correct systems programming.

**zozbot234** · 2026-03-03

LLMs are writing non-trivial math proofs in Lean, and software proofs tend to be individually easier than proofs in math, just more tedious because there's so much more of them in any non-trivial development.

Some performance issues (asymptotics) can be addressed via proof, others are routinely verified by benchmarking.

**madrox** · 2026-03-03

This assumes everything about current capabilities stay static, and it wasn't long ago before LLMs couldn't do math. Many were predicting the genAI hype had peaked this time last year.

If you want it to be a question of economics, I think the answer is in whether this approach is more economical than the alternative, which is having people run this substrate. There's a lot of enthusiasm here and you can't deny there has been progress.

I wouldn't be so quick to doubt. It costs nothing to be optimistic.

**candiddevmike** · 2026-03-04

\> and it wasn't long ago before LLMs couldn't do math

They still can't do math.

**fmbb** · 2026-03-03

There are still no successful useful vibe codes apps. Kernels are pretty far away I think.

**GoatInGrey** · 2026-03-03

To be fair, Claude Code is vibe-coded. It's a terrible piece of software from an engineering (and often usability) standpoint, and the problems run deeper than just the choice of JavaScript. But it is good enough for people to get what they want out of it.

**bunderbunder** · 2026-03-03

But also, based on what I have heard of their headcount, they are not necessarily saving any money by vibecoding it - it seems like their productivity per programmer is still well within the historical range.

That isn’t necessarily a hit against them - they make an LLM coding tool and they should absolutely be dogfooding it as hard as they can. They need to be the ones to figure out how to achieve this sought-after productivity boost. But so far it seems to me like AI coding is more similar to past trends in industry practice (OOP, Scrum, TDD, whatever) than it is different in the only way that’s ever been particularly noteworthy to me: it massively changes where people spend their time, without necessarily living up to the hype about how much gets done in that time.

**jmathai** · 2026-03-04

\> But it is good enough for people to get what they want out of it.

This is the ONLY point of software unless you’re doing it for fun.

**bonoboTP** · 2026-03-03

This is a very strange statement. People don't always announce when they use AI for writing their software since it's a controversial topic. And it's a sliding scale. I'm pretty sure a large fraction of new software has some AI involved in its development.

**qsera** · 2026-03-04

\> new software has some AI involved in its development.

A large part of it is probably just using it as a better search. Like "How do I define a new data type in go?".

**tempaccount5050** · 2026-03-03

I think this might miss the point. We put off upgrading to an new RMM at work because I was able to hack together some dashboards in a couple days. It's not novel and does exactly what we need it to do, no more. We don't need to pay 1000's of dollars a month for the bloated Solarwinds stack. We aren't saving lives, we're saving PDFs so any arguments about 5 9s and maintainability are irrelevant. LLMs are going to give us on demand, one off software. I think the SaaS market is terrified right now because for decades they've gouged customers for continual bloat and lock in that now we can escape from. In a single day I was able to build an RMM that fits our needs exactly. We don't need to hire anyone to maintain it because it's simple, like most business applications should be, but SV needs to keep complicating their offerings with bloat to justify crazy monthly costs that should have been a one time purchase from the start. SV shot itself in the face with AI.

**dehrmann** · 2026-03-04

Apps are a strange measure because there aren't really any new, groundbreaking ones. PCs and smartphones have mostly done what people have wanted them to do for a while.

**shimman** · 2026-03-04

There are plenty of ground breaking apps but they aren't making billions of advertising revenue, nor do they have large numbers. I honestly think torrent applications (and most peer to peer type of stuff) are very cool and very useful for small-medium groups but it'll never scale to a billion user thing.

Do agree it's a weird metric to have, but can't think of a better one outside of "business" but that still seems like a poor rubric because the vast majority of people care about things that aren't businesses and if this "life altering" technology basically amounts to creating digital slaves then maybe we as a species shouldn't explore the stars.

**raincole** · 2026-03-04

Name 3 apps that are

1\. widely considered successful 2. made by humans from scratch in 2025

It looks like humans and AI are on par in this realm.

**gwern** · 2026-03-04

\> I encourage everyone to RTFA and not just respond to the headline.

This is an example of an article which 'buries the lede'†.

It should have *started* with the announcement of the new zlib autoformalization (!) [https://leodemoura.github.io/blog/2026/02/28/when-ai-writes-...](https://leodemoura.github.io/blog/2026/02/28/when-ai-writes-the-worlds-software.html#a-sign-of-things-to-come) to get you excited.

*Then* it should have talked about the rest - instead of starting with rather graceless and ugly LLM-written generic prose about AI topics that to many readers is already tiresomely familiar and doubtless was tldr for even the readers who aren't repelled automatically by that.

† or in my terms, fails to 'make you care': [https://gwern.net/blog/2026/make-me-care](https://gwern.net/blog/2026/make-me-care)

**kubanczyk** · 2026-03-04

\> RTFA

Sigh. Is there any LLM solution for HN reader to filter out all top-level commenters that hadn't RTFA? I don't need the (micro-)shitstorms that these people spawn, even if the general HN algo scores these as "interesting".

**50lo** · 2026-03-03

One thing that seems under-discussed in this space is the shift from verifying programs to verifying generation processes.

If a piece of code is produced by an agent loop (prompt -> tool calls -> edits -> tests), the real artifact isn’t just the final code but the trace/pipeline that produced it.

In that sense verification might look closer to: checking constraints on the generator (tests/specs/contracts), verifying the toolchain used by the agent, and replaying generation under controlled inputs.

That feels closer to build reproducibility or supply-chain verification than traditional program proofs.

**mentalgear** · 2026-03-03

\> Where this leads is clear. Layer by layer, the critical software stack will be reconstructed with mathematical proofs built in. The question is not whether this happens, but when.

**boznz** · 2026-03-03

This is the biggest problem going forward. I wrote about the problem many times on my blog, in talks, and as premises in my sci-fi novels

Sitting in your cubical with your perfect set of test suites, code verification rules, SOP's and code reviews you wont want to hear this, but other companies will be gunning for your market; writing almost identical software to yours in the future from a series of prompts that generate the code they want fast, cheap, functionally identical, and quite possibly untested.

As AI gets more proficient and are given more autonomy (OpenClaw++) they will also generate directly executable binaries completely replacing the compiler, making it unreadable to a normal human, and may even do this without prompts.

The scenario is terrifying to professional software developers, but other people will do this regardless of what you think, and run it in production, and I expect we are months or just a few years away from this.

Source code of the future will be the complete series of prompts used to generate the software, another AI to verify it, and an extensive test suites.

**skydhash** · 2026-03-03

How do you get an extensive test suite?

**boznz** · 2026-03-04

I wish I had a crystal ball to know how this will play out in the future, will a different AI create it from the SOP? How will humans fit in?

For me with any new release of my winery production software I re-ran every job put into my clients production systems from job #1, about 200,000 jobs; Before going into production we checked all the balances, product compositions and inventory from this new software matches what the old system currently says. Takes about an hour to re-run fifteen years production and even a milliliter, or milligram difference was enough to trigger a stop/check. We had an extensive set of input data I could also feed in, to ensure mistakes were caught there too.

I expect other people do it there own way, but as a business this would be the low bar of testing I would expect to be done.

**Aldipower** · 2026-03-03

If you need to interact with some things in platform.openai.com, you know it is not months away, it is there already now. I had to go through forms and flows there, so buggy and untested, simply broken. They really eat their own dog food. Interacting with the support, resulted in literally weeks of ping pong between me and AI smoothed replies via email to fix their bugs. Terrible.

**bryanlarsen** · 2026-03-03

You can use AI to make a reviewers job much easier. Add documents, divide your MR into reviewable chunks, et cetera.

If reviewing is the expensive part now, optimize for reviewability.

**sslayer** · 2026-03-03

State Sponsored Hackers AI will verify it.

**chromaton** · 2026-03-03

TFA seems to be big on mathematical proof of correctness, but how do you ever know you're proving the right thing?

**anonhacker199** · 2026-03-03

The biggest issue right now is most AI tools aren't hooked up appropriately to an environment they can test in (Chrome typically). Replit works extremely well because it has an integrated browser and testing strategy. AI works very well when it has the ability to check its own work.

**slopinthebag** · 2026-03-03

LLM generated code combined with formal verification just feels like we're entering the most ridiculous timeline. We know formal verification doesn't work at scale, hence we don't use it. We might get fully vibe coded systems but we sure as hell won't be able to verify them.

The collapse of civilisation is real.

**bdcravens** · 2026-03-03

The same ones who verify it when I write it: my customers in production! /s (well, maybe /s)

**ozten** · 2026-03-03

This is really great and important progress, but Lean is still an island floating in space. Too hard to get actual work done building any real world system.

**nemo44x** · 2026-03-03

I believe the old ways, which agile destroyed, will come back because the implementation isn’t the hardest part now. Agile recognized correctly that implementation was the hard part to predict and that specification through requirements docs, UML, waterfall, etc. were out of date by the time the code was cooked.

I don’t think we’ll get those exact things back but we will see more specification and design than we do today.

**bwestergard** · 2026-03-03

Agile was a response to the coordination problems in certain types of firms. Waterfall persisted in organizations that have and require a more traditional bureaucratic structure. Waterfall makes sense if you are building a space probe or an unemployment insurance system, agile makes sense if you are trying to find product market fit for a smartphone app.

**nemo44x** · 2026-03-03

Yeah and why I don’t think we’ll go back to that exactly. But software designed more deliberately and requirements that are more detailed and “documented” if that’s the right word?

**miraculixx** · 2026-03-06

Sure because it worked great when we tried last time, right? Just spec it out first, and AI will churn out the perfect app. Not.

For anyone who hasn't worked in a waterfall project and would like to try: You are kidding yourself.

There is no such thing as a perfect spec. Read that again and say it outloud.

It took humanity 50 years to figure out that perfect specs are impossible, unless of course you know exactly(!) what you need. And even then, the specs are never complete.

The reality is that we often don't know, and can't know, what we want, exactly, until we actually see and experience what we said we wanted. Then we adjust. Try again.

That's the reality for individuals already. By simply using logic we can deduct that entities made of more than one individual, aka companies, will not behave better. They just make it look better by giving you a nice document that says "we want this!", only to then come around when they see what they got, and to claim "wait, we didn't mean it like so!".

That's just human nature. Not much we can do. AI will not change that.

So when some people think AI will deliver perfect software given perfect specs, hence we have to write the specs first! That is just missing the boat my a mile.

Agile is not a process but a human-friendly way of doing things. It simply says hey you want this? Let me build that and show you. Then let's adjust or move to the next thing. Rinse and repeat. Agile works because it matches how humans think and act. Step by step, day by day.

**nemo44x** · 2026-03-06

It’s why I said not those exact things. But already today when developing with agents you get best results from selecting it as much as possible so it can then logically break it into smaller contexts and iterate.

It’s not just dropping in case and getting a functional product. But more up front design seems to work best. Very explicit design.

**dataviz1000** · 2026-03-03

100% of my innovation for the past month has been getting the coding agent to iterate with an OODA loop (I make it validate after act step) trying to figure out how to get it to not stop iterating.

For example, I have discovered there is a big difference between prompting 'there is a look ahead bias' and 'there is a \[T+1\] look ahead bias' where the later will cause it to not stop until it finds the \[T+1\] look ahead bias. It will start to write scripts that will \`.shift(1)\` all values and do statistical analysis on the result set trying to find the look ahead bias.

Now, I know there isn't look ahead bias, but the point is I was able to get it to iterate automatically trying different approaches to solve the problem.

The software is going to verify itself eventually, sooner than later.

**macrolet** · 2026-03-04

Your post is not clear to me. What did you innovate? Your example is unclear.

**drivebyhooting** · 2026-03-03

That was a prolix and meandering essay. Next time I’d rather just look at the prompts and hand edits that went into writing it rather than the final artifact; much like reviewing the documentation, spec, and proof over the generated code as extolled by the article.

**phyzome** · 2026-03-03

Verify? Seems like no one is even *reviewing* this stuff.

**furyofantares** · 2026-03-03

(answering the title) The lusers

**ljlolel** · 2026-03-03

The users verify and fix it on the fly with the Claude VM JIT [https://jperla.com/blog/claude-is-a-jit](https://jperla.com/blog/claude-is-a-jit)
