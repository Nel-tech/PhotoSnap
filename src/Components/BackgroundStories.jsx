function BackgroundStories() {
  function date() {
    const CurrentYear = new Date().getFullYear();
    return CurrentYear;
  }

  function GetPreviousMonth() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    return previousMonth;
  }

  function getMonthName(monthNumber) {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[monthNumber];
  }

  return (
    <div>
      <div className="background-image">
        <h1 className="background-header">LAST MONTH FEATURED STORY </h1>
        <h2 className="background-name">HAZY FULL MOON OF APPALACHIA</h2>
        <p className="background-date">
          {getMonthName(GetPreviousMonth())} 21th {date()}{" "}
          <span className="background-author">By John Appleseed</span>
        </p>
        <p className="background-paragraph">
          The dissected plateau area, while not actually made up of geological
          mountains, is popularly called "mountains," especially in eastern
          Kentucky and West Virginia, and while the ridges are not high, the
          terrain is extremely rugged.
        </p>

        <div className="">
          <button className="btn-story">
            READ THE STORY <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default BackgroundStories;
