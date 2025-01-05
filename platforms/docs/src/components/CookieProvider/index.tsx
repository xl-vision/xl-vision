import { cookies } from 'next/headers'
import { FC } from 'react';

export type CookieProviderProps = {
    cookieKey: string;
    children: FC<{cookieValue?: string }>
};


const CookieProvider: FC<CookieProviderProps> = async (props) => {
    const { children: C, cookieKey } = props;

    const cookieStore = await cookies()

    const value = cookieStore.get(cookieKey)?.value

    return <C cookieValue={value} />
};

export default CookieProvider;
