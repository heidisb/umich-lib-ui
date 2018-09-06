import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'

import { Header } from 'umich-lib-components-react'
import SideNav from 'sidenav'
import '../../../src/docs/styles.css'
import getSideNavData from '../../utils/get-side-nav-data'

const Layout = ({ children }) => (
  <StaticQuery
    query={graphql`
      query LayoutQuery {
        site {
          siteMetadata {
            title
          }
        }
        allSideNavPagesYaml {
          edges {
            node {
              page
              pages
            }
          }
        }
        allMarkdownRemark {
          edges {
            node {
              frontmatter {
                title
              }
              fields {
                name
              }
              htmlAst
            }
          }
        }
      }
    `}
    render={data => (
      <>
        <Helmet
          title={data.site.siteMetadata.title}
          meta={[
            { name: 'description', content: 'Sample' },
            { name: 'keywords', content: 'sample, something' },
          ]}
        >
          <html lang="en" />
        </Helmet>
        <Header name="Design System" />
        <div className="docs">
          <SideNav data={getSideNavData(data)} />
          <div className="docs__content">
            <div className="docs__content-inner y-spacing">
              {children}
            </div>
          </div>
        </div>
      </>
    )}
  />
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout