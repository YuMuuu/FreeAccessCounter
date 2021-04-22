# ref: https://qiita.com/impl_s/items/5a24a0bdc55ade4d8727#dockerfile%E3%82%92%E4%BD%9C%E6%88%90

FROM debian:stable-slim

WORKDIR /src

RUN apt-get -qq update \
  && apt-get -qq -y install curl zip unzip \
  && curl -fsSL https://deno.land/x/install/install.sh | sh \
  && rm -f ./install.sh \
  && apt-get -qq remove curl zip unzip \
  && apt-get -qq remove --purge -y curl zip unzip \
  && apt-get -qq -y autoremove \
  && apt-get -qq clean

ENV DENO_INSTALL="/root/.deno" 
ENV PATH $DENO_INSTALL/bin:$PATH

CMD ["deno"]