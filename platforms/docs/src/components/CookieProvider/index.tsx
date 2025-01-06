import { cookies } from 'next/headers';
import { cloneElement, FC, ReactElement } from 'react';

export type CookieProviderProps = {
  cookiekey: string;
  children: ReactElement<{ cookieValue?: string }>;
};

const CookieProvider: FC<CookieProviderProps> = async ({ cookiekey, children }) => {
  const cookieStore = await cookies();

  const cookieValue = cookieStore.get(cookiekey)?.value;

  return cloneElement(children, {
    ...children.props,
    cookieValue,
  });
};

export default CookieProvider;
