// Landing page hero, only shown to signed-out visitors
const Hero = () => {
    return (
        <section className="flex flex-col gap-8 pt-12 pb-12 md:pt-16 md:pb-16">
            <h1 className="text-4xl leading-[1.08] font-bold text-balance uppercase font-display sm:text-6xl lg:text-7xl">
                The{" "}
                {/* Slanted block running from the attacker color to the defender color */}
                <em className="inline-block -skew-x-8 bg-linear-to-r/oklch from-attack to-defend px-[0.18em] text-background not-italic">
                    <span className="inline-block skew-x-8">Ultimate</span>
                </em>{" "}
                tool to elevate your Siege experience
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
                Roll a random operator, build your own loadout, or grab a
                challenge to shake up your squad&apos;s next match.
            </p>
        </section>
    );
};

export default Hero;
