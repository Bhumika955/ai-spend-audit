# User Interviews

Three conversations with potential users conducted during the week of May 7–11, 2026. Each conversation was 10–15 minutes, conducted over WhatsApp call or in person.

## Interview 1 — Nitya S., Final Year B.Tech CS Student

**Role:** Final year B.Tech Computer Science student, working on personal projects and internship prep.
**Company stage:** Pre-employment, active side project user.
**Date:** May 10, 2026

**Summary:**
Nitya started with ChatGPT Plus (paying ~₹500/month) and recently switched to Claude Pro. The switch was driven by quality — Claude's responses felt more accurate for coding tasks and it works better with real-time and recent information, whereas ChatGPT had noticeable lag in picking up newer trends and libraries.

The most frustrating experience she described was hitting ChatGPT's monthly usage limits before the billing cycle ended. She was paying for a plan but running out of quota mid-month, which felt like paying for something she couldn't fully use.

**Direct quotes:**
- *"ChatGPT ke limits mid-month khatam ho jaate the — pay karo aur fir bhi ruk jao, ye frustrating tha."*
- *"Claude ke results zyada accurate lagte hain, especially new cheezон pe — ChatGPT mein purana data zyada feel hota tha."*
- *"Mujhe pata nahi tha ki main wrong plan pe thi jab tak kisi ne compare karke nahi bataya."*

**Most surprising thing she said:**
She didn't know there were multiple Claude plans (Pro vs Max vs Team). She was on Pro and assumed it was the only paid option. The idea that she might be underpaying for her actual usage level — or that a team plan might apply to her study group — had never occurred to her. Most users assume one paid tier exists.

**What it changed about the design:**
Added a plan comparison tooltip on the tool selection form so users can see what each plan includes before entering their current spend. Also made the audit reason field more educational — explaining *what* each plan is for, not just recommending a switch.

---

## Interview 2 — Swati R., IT Developer

**Role:** Junior IT Developer, working at a mid-size company.
**Company stage:** Employed, uses AI tools independently for work productivity.
**Date:** May 11, 2026

**Summary:**
Swati uses Google Gemini on the free tier and has never paid for any AI tool. Her experience with Gemini Free has been so positive that she has genuinely not felt the need to upgrade. The free tier exceeded her expectations — she went in expecting basic responses and got results she described as surprisingly high quality for her day-to-day development work.

What was interesting: she's not price-sensitive — she just hasn't hit a wall that would justify paying. She uses it for code explanations, documentation help, and quick reference, none of which push against free tier limits.

**Direct quotes:**
- *"Maine socha tha free mein kuch khaas nahi milega — but Gemini ne expectation se zyada diya."*
- *"Paid lene ki zarurat hi nahi padi abhi tak — kaam chal jaata hai."*
- *"Agar limits aane lagein toh sochungi, but abhi toh fine hai."*

**Most surprising thing she said:**
She was unaware that her company might reimburse AI tool costs. She was evaluating entirely on personal budget when her actual decision-maker was her employer. This is a common blind spot — individual contributors thinking about personal spend when the right frame is "can I expense this?"

**What it changed about the design:**
Added a note on the results page for zero-savings / already-optimal cases: *"If your company doesn't already cover these tools, most tech employers will reimburse AI tool costs — worth asking."* This adds value even when the audit finds no savings opportunity.

---

## Interview 3 — Arjun M., Freelance Web Developer

**Role:** Freelance frontend developer, 2 years experience, works with 3–4 clients simultaneously.
**Company stage:** Solo freelancer, billing clients hourly.
**Date:** May 11, 2026

**Summary:**
Arjun pays for both Cursor Pro ($20/month) and GitHub Copilot Individual ($10/month) simultaneously — a redundancy he hadn't thought about until the conversation. He chose Cursor originally for its chat interface and chose Copilot because a client's codebase already had it set up and he didn't want to reconfigure. He kept both running without evaluating whether the overlap made sense.

He also mentioned that he tried to calculate his AI tool ROI once and gave up because "there's no easy way to see what I'm actually getting per dollar."

**Direct quotes:**
- *"Maine kabhi nahi socha tha ki dono simultaneously chal rahe hain — ek client ke liye Copilot, baaki ke liye Cursor."*
- *"ROI calculate karna mushkil hai — pata nahi kitna time actually save hota hai."*
- *"Agar koi tool mujhe directly bata de ki main overpay kar raha hoon, toh main sun'ta."*

**Most surprising thing he said:**
He said he would trust a savings recommendation *more* if it came with a reason he could explain to his accountant — not just "switch to X" but "you're paying for Y feature you don't use." The reasoning matters as much as the number for someone who tracks business expenses.

**What it changed about the design:**
This directly influenced the audit result card design. Each tool card now shows a one-sentence reason in plain English ("Business plan adds SSO and admin controls — with 1 user, Pro gives identical AI features at half the cost") rather than just a recommendation. The reasoning is the product, not just the output.