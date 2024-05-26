![Logo fyrir veiðibann](./extension/icon128.png)

# Veiðibann

Finnst þér fyrirsagnirnar á mbl.is óskýrar og bara til þess gerðar að fá þig til að smella á þær? Veiðibann skiptir óskýrum fyrirsögnum út á forsíðunni og gerir þér kleyft að taka upplýsta ákvörðun áður en þú smellir á fréttina.

## Hvar virkar þetta?

Í augnablikinu virkar þetta bara á forsíðunni á mbl.is og á Chrome, en það ætti ekki að vera mikið mál að útfæra þetta fyrir fleiri síður. Endilega sendu pull-request ef þú vilt hjálpa.

## Hvernig set ég þetta upp?

Eftir að þú klónar möppuna (e. repository), þá getur þú opnað Chrome, [farið í stillingar fyrir viðbætur](chrome://extensions/), smellt á "Load unpacked" og hlaðið upp "extension"- möppunni, endurhlaðið Chrome, og prófað að fara inn á mbl.is.

## Hvernig virkar þetta?

Verkefnið notar [Cloudflare Workers (vinnumenn)](https://workers.cloudflare.com/) og [GPT-4o frá OpenAI](https://openai.com/index/hello-gpt-4o/) til þess að endurskrifa óskýrar fyrirsagnir. Mjög einföld vafraviðbót (e. browser extension) talar síðan við vinnumanninn, skiptir út fyrisögnunum og vistar fyrirsagnirnar síðan í vafranum til þess að viðbótin þurfi ekki að sækja fyrirsagnir sem hún hefur séð aftur.

Hérna er dæmi um fyrirsögn sem Veiðibann hefur lagað:

![Tvær útgáfur af fyrisögnum](./screenshot.png)
