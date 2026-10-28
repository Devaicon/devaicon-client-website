const STEPS = [
  {
    title: "Apply",
    when: "Day 1",
    text: "Send your résumé and a few lines on why the role interests you. It takes about five minutes.",
  },
  {
    title: "Screening call",
    when: "Within 2 weeks",
    text: "If your experience matches, our hiring team calls to talk through the role and answer your questions.",
  },
  {
    title: "Interviews",
    when: "2–3 weeks",
    text: "Meet the hiring manager and future teammates for technical and conversational interviews.",
  },
  {
    title: "Offer and onboarding",
    when: "About 1 week",
    text: "Receive your offer. Once you accept, we set you up with everything you need for your first day.",
  },
];

// Where each step's rail runs on to the next one: not from the end of a row
// (step 2 on tablets, two to a row) and never from the last step.
const ACROSS = ["sm:block", "lg:block", "sm:block"];

/** The four stages, in order, with how long each usually takes. */
export default function HiringProcess() {
  return (
    <section id="hiring-process" aria-labelledby="hiring-heading" className="scroll-mt-24 bg-gray-50 py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-6 xl:px-15">
        <div className="max-w-2xl">
          <h2 id="hiring-heading" className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            How hiring works
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-gray-600">
            Most people hear back within two weeks and have an answer within six.
          </p>
        </div>

        {/* A rail runs through the step markers: down the side on phones,
            across the top from tablets up. */}
        <ol className="relative mt-12 grid gap-10 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <li key={step.title} className="relative pl-14 sm:pl-0 sm:pt-14">
              <span
                aria-hidden
                className={`absolute left-[1.1875rem] top-10 -bottom-10 w-px bg-gray-300 sm:hidden ${i === STEPS.length - 1 ? "hidden" : ""}`}
              />
              <span aria-hidden className={`absolute left-10 right-[-2rem] top-5 hidden h-px bg-gray-300 ${ACROSS[i] ?? ""}`} />
              <span className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-[#3d234b] text-sm font-bold text-white">
                {i + 1}
              </span>
              <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
              <p className="mt-1 text-sm font-medium text-[#3d234b]">{step.when}</p>
              <p className="mt-3 leading-relaxed text-gray-600">{step.text}</p>
            </li>
          ))}
        </ol>

        <p className="mt-12 text-gray-600">
          Questions about applying? Email{" "}
          <a href="mailto:careers@devaicon.com" className="font-medium text-[#3d234b] underline hover:text-[#2d1a3b]">
            careers@devaicon.com
          </a>{" "}
          and our hiring team will reply.
        </p>
      </div>
    </section>
  );
}
