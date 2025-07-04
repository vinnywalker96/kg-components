'use client'

import { useLanguage } from "@/lib/i18n/language-context"

export default function AboutPage() {
  const { t } = useLanguage()
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2">{t('aboutTitle')}</h1>
          <p className="text-muted-foreground">
            {t('aboutSubtitle')}
          </p>
        </div>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">{t('ourStory')}</h2>
            <p className="mb-4">
              {t('ourStoryPart1')}
            </p>
            <p>
              {t('ourStoryPart2')}
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">{t('ourMission')}</h2>
            <p>
              {t('ourMissionText')}
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">{t('whatSetsUsApart')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-muted/30 p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-2">{t('qualityAssurance')}</h3>
                <p>
                  {t('qualityAssuranceText')}
                </p>
              </div>
              
              <div className="bg-muted/30 p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-2">{t('extensiveSelection')}</h3>
                <p>
                  {t('extensiveSelectionText')}
                </p>
              </div>
              
              <div className="bg-muted/30 p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-2">{t('expertSupport')}</h3>
                <p>
                  {t('expertSupportAboutText')}
                </p>
              </div>
              
              <div className="bg-muted/30 p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-2">{t('fastShipping')}</h3>
                <p>
                  {t('fastShippingAboutText')}
                </p>
              </div>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">{t('ourTeam')}</h2>
            <p className="mb-4">
              {t('ourTeamPart1')}
            </p>
            <p>
              {t('ourTeamPart2')}
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">{t('sustainabilityCommitment')}</h2>
            <p className="mb-4">
              {t('sustainabilityPart1')}
            </p>
            <p>
              {t('sustainabilityPart2')}
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">{t('joinOurCommunity')}</h2>
            <p className="mb-4">
              {t('joinOurCommunityPart1')}
            </p>
            <p>
              {t('joinOurCommunityPart2')}
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

