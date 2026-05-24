import React from "react"
import PortfolioSlide from "./PortfolioSlide"
import { portfolios } from "../../configs/portfolioConfig"

export default function TeamScrollSection(): React.JSX.Element {
  return (
    <section
      className="
        relative
        h-screen
        overflow-y-scroll
        w-full
        snap-y
        snap-mandatory
        scroll-smooth
        bg-black
        hide-scrollbar
      "
    >
      {portfolios.map((portfolio) => (
        <PortfolioSlide
          key={portfolio.id}
          portfolio={portfolio}
        />
      ))}
    </section>
  )
}
