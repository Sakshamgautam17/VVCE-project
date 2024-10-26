import cv2
import numpy as np
from skimage.metrics import structural_similarity as ssim

def compare_images(img1, img2):
    # Convert images to grayscale
    gray1 = cv2.cvtColor(img1, cv2.COLOR_BGR2GRAY)
    gray2 = cv2.cvtColor(img2, cv2.COLOR_BGR2GRAY)
    
    # Resize second image to match first image dimensions
    gray2 = cv2.resize(gray2, (gray1.shape[1], gray1.shape[0]))
    
    # Initialize SIFT detector
    sift = cv2.SIFT_create()
    
    # Detect keypoints and compute descriptors
    keypoints1, descriptors1 = sift.detectAndCompute(gray1, None)
    keypoints2, descriptors2 = sift.detectAndCompute(gray2, None)
    
    # Initialize matcher
    bf = cv2.BFMatcher()
    
    # Match descriptors
    if descriptors1 is not None and descriptors2 is not None:
        matches = bf.knnMatch(descriptors1, descriptors2, k=2)
        
        # Apply ratio test
        good_matches = []
        for m, n in matches:
            if m.distance < 0.75 * n.distance:
                good_matches.append(m)
        
        # Calculate similarity score
        similarity_score = len(good_matches) / max(len(keypoints1), len(keypoints2))
        
        # Calculate SSIM for additional comparison
        ssim_score = ssim(gray1, gray2)
        
        return similarity_score, ssim_score, len(good_matches)
    
    return 0, 0, 0

def main():
    # Load reference image
    reference = cv2.imread('ref.jpg')
    if reference is None:
        print("Error: Could not load reference image 'ref.jpg'")
        return
    
    # Initialize video capture
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Could not open camera")
        return
    
    while True:
        ret, frame = cap.read()
        if not ret:
            print("Error: Could not read frame")
            break
            
        # Compare current frame with reference image
        feature_score, ssim_score, num_matches = compare_images(frame, reference)
        
        # Draw comparison results on frame
        text = f"Matches: {num_matches}"
        cv2.putText(frame, text, (10, 110), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        
    
        # Display the frame
        cv2.imshow('Camera Feed', frame)
        
        # Break loop on 'q' press
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    
    # Cleanup
    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()