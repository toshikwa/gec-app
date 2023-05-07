import Head from "next/head";
import { siteConfig } from "lib/config";

interface MetaProps {}

const Meta = ({}: MetaProps) => {
  return (
    <Head>
      <title>{siteConfig.title}</title>
      <meta property="og:title" content={siteConfig.title} />
      <meta name="description" content={siteConfig.subtitle} />
      <meta property="og:description" content={siteConfig.subtitle} />
    </Head>
  );
};

export default Meta;
