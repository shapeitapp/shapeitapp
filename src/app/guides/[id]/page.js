import fs from 'fs'
import path from 'path'
import { remark } from 'remark'
import html from 'remark-html'
import matter from 'gray-matter'

import Head from 'next/head'
import Footer from '@/components/Footer'
import TopNavigation from '@/components/TopNavigation'
import Guide from '@/components/Guide'

export default async function GuidePage({params}) {
  const postsDirectory = path.join(process.cwd(), 'docs')
  async function getDocumentation(id) {
    const fullPath = path.join(postsDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
  
    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);
  
    // Use remark to convert markdown into HTML string
    const processedContent = await remark()
      .use(html)
      .process(matterResult.content);
    const contentHtml = processedContent.toString();
  
    // Combine the data with the id and contentHtml
    return {
      id,
      contentHtml,
      ...matterResult.data,
    };
  }

  const content = await getDocumentation(params.id)

  return (
    <div className="flex flex-col w-screen max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      <TopNavigation />
      <div className="py-8 flex-1">
        <Head>
          <title>Shape It! - Projects</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Guide title={content.title} date={content.date} content={content.contentHtml}/>
      </div>
      <Footer />
    </div>
  )
}