import { Component } from 'solid-js';

export interface ErrorCodeProps {
  code: number;
  text: string;
}

const ErrorCode: Component<ErrorCodeProps> = (props) => {
  return (
    <h1 class='text-center font-bold'>
      <span class='text-xl'>ERROR</span>
      <br />
      <span class='text-5xl'>{props.code}</span>
      <br />
      <span>{props.text}</span>
    </h1>
  );
};

export default ErrorCode;
