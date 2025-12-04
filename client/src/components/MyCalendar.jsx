import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "../styles/calendar.module.css";

export default function MyCalendar() {
  const [value, setValue] = useState(new Date());

  return (
    <>
      <div className={styles.calendarBackground}>
        <div className={styles.calendarContainer}>
          <div className={styles.calendar}>
            <div className={styles.wrapper}>
              <Calendar onChange={setValue} value={value} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
