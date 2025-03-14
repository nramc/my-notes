import re
import urllib.parse
from textwrap import dedent

x_intent = "https://x.com/intent/tweet"
fb_sharer = "https://www.facebook.com/sharer/sharer.php"
linkedin_sharer = "https://www.linkedin.com/sharing/share-offsite/"
reddit_sharer = "https://www.reddit.com/submit"
whatsapp_sharer = "https://api.whatsapp.com/send"
hackernews_sharer = "https://news.ycombinator.com/submitlink"

include = re.compile(r"^blog/(?!index\.html).*")


def on_page_markdown(markdown, **kwargs):
    page = kwargs['page']
    config = kwargs['config']

    if not include.match(page.url):
        return markdown

    page_url = config.site_url + page.url
    page_title = urllib.parse.quote(page.title + '\n')

    return markdown + dedent(f"""
    Share on: 
    [:fontawesome-brands-square-x-twitter: X (Twitter)]({x_intent}?text={page_title}&url={page_url}){{ .link-sm target="_blank" title="Share on X" }}
    [:fontawesome-brands-facebook: Facebook]({fb_sharer}?u={page_url}){{ .link-sm target="_blank" title="Share on Facebook" }}
    [:fontawesome-brands-linkedin: LinkedIn]({linkedin_sharer}?url={page_url}){{ .link-sm target="_blank" title="Share on LinkedIn" }}
    [:fontawesome-brands-reddit: reddit]({reddit_sharer}?url={page_url}&title={page_title}){{ .link-sm target="_blank" title="Share on Reddit" }}
    [:fontawesome-brands-whatsapp: WhatsApp]({whatsapp_sharer}?text={page_title}%20{page_url}){{ .link-sm target="_blank" title="Share on WhatsApp" }}
    [:fontawesome-brands-hacker-news: Hacker News]({hackernews_sharer}?u={page_url}&t={page_title}){{ .link-sm target="_blank" title="Share on Hacker News" }}
    """)
