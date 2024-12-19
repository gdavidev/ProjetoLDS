import { useEffect, useState } from "react";

type TimerProps = {
  startTime: number
  className?: string
  onStop?: () => void
}

export default function Timer(props: TimerProps) {
  const [ currentTime, setCurrentTime ] = useState<number>(props.startTime);

  useEffect(() => {
    if (currentTime > 0) {
      setTimeout(() => setCurrentTime(time => time - 1), 1000);
    } else {
      props.onStop?.();
    }
  }, [currentTime]);

  return (<span>{currentTime}</span>)
}