import { z } from "zod"
import type { dispatch } from "src/lib/markdoc/frontmatter.schema"
import type { RenderableTreeNode } from "@markdoc/markdoc"

type DispatchFrontmatter = z.infer<typeof dispatch>

type DispatchPost = {
  slug: string,
  content: RenderableTreeNode,
  frontmatter: DispatchFrontmatter
}

export const getChronologicalDispatches = (posts: DispatchPost[]) => {
  return posts
    .filter((h) => h.frontmatter.draft !== true)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.when).valueOf() -
        new Date(a.frontmatter.when).valueOf()
    );
}

export const combineDispatchesInLocation = (posts: DispatchPost[]) => {
  const dispatches: Record<number, DispatchPost[]> = {};
  let index = 0;
  for (let i = 0; i < posts.length; i++) {
    if (i === 0)
      dispatches[index] = [posts[i]];
    else if (posts[i].frontmatter.location === posts[i - 1].frontmatter.location)
      dispatches[index - 1].push(posts[i]);
    else
      dispatches[++index] = [posts[i]];
  }
  return dispatches
}