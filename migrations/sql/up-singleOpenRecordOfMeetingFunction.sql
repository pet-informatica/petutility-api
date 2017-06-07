CREATE FUNCTION singleOpenRecordOfMeetingFunction() RETURNS trigger AS
$$
  DECLARE
    countOpenRecordsOfMeeting integer;
  BEGIN
    SELECT count(*) INTO countOpenRecordsOfMeeting FROM "RecordOfMeeting" WHERE "RecordOfMeeting"."Status" = 1;
    IF countOpenRecordsOfMeeting > 0 THEN
      RETURN NULL;
    END IF;
    RETURN NEW;
  END;
$$ LANGUAGE plpgsql;
