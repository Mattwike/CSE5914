select token From profiles inner join profile_tokens 
ON profiles.id = profile_tokens.id
where profiles.id = :id