function Flex() {
  return (
    <div>
      <div className="flex-work">
        <section>
          <img src="/images/features/desktop/responsive.svg" alt="" />

          <h1 className="flex-header">100% Responsive</h1>
          <p>
            No matter which the device you’re on, our site is fully responsive
            and stories look beautiful on any screen.
          </p>
        </section>

        <section>
          <img src="/images/features/desktop/no-limit.svg" alt="" />

          <h1 className="flex-apart">No Photo Upload Limit</h1>
          <p className="flex-paragraph">
            Our tool has no limits on uploads or bandwidth. Freely upload in
            bulk and share all of your stories in one go.
          </p>
        </section>

        <section>
          <img src="/images/features/desktop/embed.svg" alt="" />

          <h1 className="flex-header">Available to Embed</h1>
          <p>
            Embed Tweets, Facebook posts, Instagram media, Vimeo or YouTube
            videos, Google Maps, and more.
          </p>
        </section>
      </div>
    </div>
  );
}

export default Flex;
