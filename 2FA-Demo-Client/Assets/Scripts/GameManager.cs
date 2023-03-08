using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;

[System.Serializable]
public class Bid
{
    public string itemName;
    public float amount;
    public string bidderName;
    public string bidderAddress;
    public string bidStatus;
    public System.DateTime createdOn;
}

[System.Serializable]
public class BidResponse
{
    public Bid[] bids;
}

public class GameManager : MonoBehaviour
{

    public GameObject itemKnife;
    public GameObject itemGun;
    public int selectedItem;

    public List<GameObject> bidders;
    public int selectedBidder;
    // Start is called before the first frame update
    void Start()
    {
        selectedItem = 0;
        this.changeItem(selectedItem);
        // Set random initisalisation for making it unselected
        this.changeBidder(100);
        StartCoroutine(FetchData());


    }


    public IEnumerator FetchData()
    {
        using (UnityWebRequest request = UnityWebRequest.Get("http://localhost:3000/api/v1/bids"))
        {
            yield return request.SendWebRequest();
            if (request.result == UnityWebRequest.Result.ConnectionError)
            {
                Debug.Log(request.error);
            }
            else
            {
                Debug.Log(request.downloadHandler.text);

                foreach (var obj in JsonUtility.FromJson<BidResponse>(request.downloadHandler.text).bids)
                {
                  //  Console.WriteLine(obj);
                    Debug.Log(obj.itemName);
                }

            //    Bid[] bidList = new PlayerStatus();
            //    playerStat = JsonUtility.FromJson<PlayerStatus>(request.downloadHandler.text);
            //    playerStatusPanel.transform.GetChild(0).GetComponent<Text>().text = playerStat.playerName;
            //    playerStatusPanel.transform.GetChild(1).GetComponent<Text>().text = "HP : " + playerStat.hp.ToString();
            }
        }
    }


    // Update is called once per frame
    void Update()
    {
        
    }

    public void changeItem(int selectedId)
    {
        Debug.Log("Changing selected Item to " + selectedId.ToString());
        selectedItem = selectedId;
        if (selectedId == 0)
        {
            GameObject selectedItem = this.itemKnife.transform.GetChild(0).gameObject;
            selectedItem.SetActive(true);
            GameObject otherItem = this.itemGun.transform.GetChild(0).gameObject;
            otherItem.SetActive(false);
        }
        if (selectedId == 1)
        {
            GameObject selectedItem = this.itemGun.transform.GetChild(0).gameObject;
            selectedItem.SetActive(true);
            GameObject otherItem = this.itemKnife.transform.GetChild(0).gameObject;
            otherItem.SetActive(false);
        }
    }

    public void changeBidder(int selectedId)
    {
        Debug.Log("Changing selected Bidder to " + selectedId.ToString());
        selectedBidder = selectedId;
        for (int i = 0; i < this.bidders.Count; i++)
        {
            GameObject bidder = this.bidders[i];
            if (i == selectedId)
            {
                GameObject selectedItem = bidder.transform.GetChild(0).gameObject;
                selectedItem.SetActive(true);
            } else {
                GameObject selectedItem = bidder.transform.GetChild(0).gameObject;
                selectedItem.SetActive(false);
            }
        }
    }

    public void AwardBid ()
    {
        // Call the POST /transactions API and send the meta data

    }

    IEnumerator CreateTransaction()
    {
        WWWForm form = new WWWForm();
        form.AddField("myField", "myData");

        using (UnityWebRequest www = UnityWebRequest.Post("https://www.my-server.com/myform", form))
        {
            yield return www.SendWebRequest();

            if (www.result != UnityWebRequest.Result.Success)
            {
                Debug.Log(www.error);
            }
            else
            {
                Debug.Log("Form upload complete!");
            }
        }
    }

}
