FROM iojs:2.5.0
MAINTAINER Brandon Papworth "brandon@powertower.com"

ENV NODE_ENV development

RUN mkdir /data

COPY __bootstrap.js /data/

WORKDIR /data

VOLUME ["/data"]

ENTRYPOINT ["iojs"]

CMD ["--es_staging", "--harmony_array_includes", "--harmony_arrays", "--harmony_classes", "--harmony_modules", "--harmony_numeric_literals", "--harmony_object_literals", "--harmony_proxies", "--harmony_regexps", "--harmony_tostring", "__bootstrap.js"]
