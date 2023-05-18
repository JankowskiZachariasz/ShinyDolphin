FROM postgres:14

RUN apt-get update; \
    apt-get install -y --no-install-recommends postgresql-14-wal2json; \
    rm -rf /var/lib/apt/lists/*; \
	find /usr -name '*.pyc' -type f -exec bash -c 'for pyc; do dpkg -S "$pyc" &> /dev/null || rm -vf "$pyc"; done' -- '{}' +;

COPY ./docker-entrypoint-initdb.d /docker-entrypoint-initdb.d

CMD ["postgres", "-c", "wal_level=logical", "-c", "max_replication_slots=10", "-c", "max_wal_senders=10" ]