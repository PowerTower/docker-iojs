FROM iojs:2.5.0
MAINTAINER Brandon Papworth "brandon@powertower.com"

ENV NODE_ENV development
ENV PORT 8080

RUN mkdir -p /data

COPY index.js /data/

WORKDIR /data

VOLUME ["/data"]

EXPOSE 8080

ENTRYPOINT ["iojs"]

CMD ["--es_staging", "--harmony_array_includes", "--harmony_arrays", "--harmony_classes", "--harmony_modules", "--harmony_numeric_literals", "--harmony_object_literals", "--harmony_proxies", "--harmony_regexps", "--harmony_tostring", "index.js"]
