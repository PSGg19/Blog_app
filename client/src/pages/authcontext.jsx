useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);
  