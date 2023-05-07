import { containerStyle } from "./Container.css";

interface ContainerProps {
  children?: JSX.Element | JSX.Element[];
  wide?: boolean;
}

const Container = ({ children, wide = false }: ContainerProps) => (
  <div className={wide ? containerStyle.wide : containerStyle.default}>
    {children}
  </div>
);

export default Container;
