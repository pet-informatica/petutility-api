CREATE TRIGGER singleOpenRecordOfMeetingTrigger BEFORE INSERT ON "RecordOfMeeting" FOR EACH ROW EXECUTE PROCEDURE singleOpenRecordOfMeetingFunction();
