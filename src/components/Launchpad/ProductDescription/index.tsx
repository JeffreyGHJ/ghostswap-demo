import { ExternalLink as ExternalLinkIcon } from 'react-feather'
import ExternalLink from '../../ExternalLink'

const subheading = ' text-[20px] ts-3 pb-3 pt-1 '
const paragraph = ' mb-3 ts-1 text-pink '
const bulletPoint = ' ts-1 text-pink '
const linkBadge =
  'flex gap-2 px-3 py-2 border border-[#2181e7] border-opacity-[15%] rounded-full cursor-pointer hover:text-gray-300 text-white'

const ProductDescription = () => {
  return (
    <div id="product-description" className="w-full flex flex-col gap-4 md:max-w-[40%] pb-10">
      <div id="collection-title" className="text-[58px] font-bold ts-3 tracking-tighter leading-[1]">
        SoulEaters {'(MATIC)'}
      </div>
      <div id="links" className="flex flex-wrap gap-4">
        <ExternalLink href="https://whitepaper.littleghosts.com/" className={linkBadge}>
          <ExternalLinkIcon size={20} strokeWidth={1} />
          Whitepaper
        </ExternalLink>
        <ExternalLink href="https://souleaters.xyz/" className={linkBadge}>
          <ExternalLinkIcon size={20} strokeWidth={1} />
          Website
        </ExternalLink>
        <ExternalLink href="https://discord.gg/ghostlabs" className={linkBadge}>
          <ExternalLinkIcon size={20} strokeWidth={1} />
          Discord
        </ExternalLink>
        <ExternalLink href="https://twitter.com/SoulEatersXyz" className={linkBadge}>
          <ExternalLinkIcon size={20} strokeWidth={1} />
          Twitter
        </ExternalLink>
      </div>
      <div>
        <div id="sub-heading" className={subheading}>
          Backstory
        </div>
        <div id="paragraph" className={paragraph}>
          The Etherworld has been rocked by a series of mysterious and ominous events. A pulsating purple portal has
          been discovered, unleashing a horde of shadow creatures that lurk in the shadows. The source of a powerful and
          coveted Blue Potion has been discovered in a mystical cave in the Desert of Despair, sparking a race among the
          shadow-dwelling creatures to harness its formidable power. Meanwhile, a malevolent faction called the
          SoulEaters has amassed a great army of shadow creatures and demons, threatening to engulf the entire realm in
          darkness.
        </div>
        <div id="paragraph" className={paragraph}>
          In the face of these daunting challenges, the region leaders of the Etherworld are at a loss, unsure of how to
          stop the impending darkness. But a glimmer of hope emerges from an unexpected source - the LittleGhosts, a
          small and often-overlooked group of mischievous spirits, possess a secret weapon that could prove to be the
          key to defeating the SoulEaters.
        </div>
        <div id="paragraph" className={paragraph}>
          The stage is set for an epic battle between light and darkness, with the fate of the entire Etherworld hanging
          in the balance. Will the LittleGhosts be able to rally the inhabitants of the land and vanquish the
          SoulEaters, or will the forces of darkness prevail and bring chaos and destruction to the realm? Only time
          will tell.
        </div>
        <div id="sub-heading" className={subheading}>
          Technicals
        </div>
        <div id="paragraph" className={paragraph}>
          As the creators of SoulEaters, we are excited to announce the launch of our malevolent faction with a total
          supply of 6,600 NFTs. We will split these NFTs in the following ways: 1,000 reserved for whitelist, 5,000
          available to the public,100 put into a trading pool here on GhostSwap, and 500 that can be acquired by
          sacrificing a LittleGhost.{' '}
        </div>
        <div id="paragraph" className={paragraph}>
          To get on the whitelist, we will collaborate with other top Polygon projects and offer certain users an
          exclusive opportunity to join our community. This will be done through a variety of different methods, giving
          our partners' users a chance to gain access to our limited whitelist.
        </div>
        <div id="paragraph" className={paragraph}>
          To promote liquidity in our community and help users buy and sell NFTs more easily, we will put 10% of our
          total mint funds into a trading pool on GhostSwap to create a sustainable backed floor model. This pool will
          be filled with 100 NFTs kept back from the initial mint, and the funds raised from the sale of these NFTs will
          be used to buy more NFTs, thereby further increasing the liquidity pool even more.
        </div>
        <div id="paragraph" className={paragraph}>
          We recognize that one of the biggest problems with NFTs is the lack of liquidity, and we believe that a
          portion of the initial mint should be used to help solve this problem. By backing our launch with a liquidity
          pool, we hope to create a sustainable market for our NFTs and ensure that users can buy and sell their NFTs
          with ease.
        </div>
        <div id="sub-heading" className={subheading}>
          Utilities:
        </div>
        <div id="bullet-list" className="pb-3 pl-3">
          <div id="bullet-point " className={bulletPoint}>
            <b className="mr-1">•</b>Be apart of one of the great NFT movements on Polygon.
          </div>
          <div id="bullet-point " className={bulletPoint}>
            <b className="mr-1">•</b>Take part in events that will happen against LittleGhosts for prizes
          </div>
          <div id="bullet-point " className={bulletPoint}>
            <b className="mr-1">•</b>Explore the Etherworld as your SoulEater in Phantasma MMO.
          </div>
          <div id="bullet-point " className={bulletPoint}>
            <b className="mr-1">•</b>Be a part of history as the first NFT launched on GhostSwap.
          </div>
        </div>
        <div id="sub-heading" className={subheading}>
          Marketing plans
        </div>
        <div id="paragraph" className={paragraph}>
          Ghost Labs is dedicated to creating exceptional products in DeFi, GameFi, and SocialFi. As a part of this
          mission, SoulEaters will play an integral role in building a solid foundation on Polygon. Our experience with
          BNBChain and the successful launch of GhostSwap and Phantasma have prepared us for this challenge.
        </div>
        <div id="paragraph" className={paragraph}>
          Our leader and developer, Tyeler, is committed to driving Ghost Labs to the top, even in the face of
          adversity. This year, our focus is on expanding our reach, building a strong community, and continuing to
          innovate as we always have. With this mindset, we are confident that we can continue to push the boundaries of
          what is possible in the world of blockchain technology.
        </div>
        <div id="paragraph" className={paragraph}>
          Our plan is to market both Phantasma and GhostSwap through various channels including Twitter ads,
          partnerships, and influencers. By growing these products and our community, we aim to provide exciting
          opportunities for NFT enthusiasts within the Web3 ecosystem. With our community's support and our unwavering
          dedication to innovation, we are confident that this will be the year of the ghost.{' '}
        </div>
      </div>
    </div>
  )
}

export default ProductDescription
